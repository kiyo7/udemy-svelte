<script>
  import { onMount, onDestroy } from 'svelte';
  import { Router, Link } from 'svelte-routing';

  import { signInWithGoogle } from '../helpers/firebase';

  import { Button, ProgressCircular, TextField } from 'smelte';
  import { userId } from '../store';
  import { fetch } from '../helpers/api';
  import StarRating from 'svelte-star-rating';
  import dayjs from 'dayjs';

  let uid, filterMonth;
  const unSubscribe = userId.subscribe((id) => (uid = id));
  let promise = fetch();

  onMount(async () => {
    console.log(uid);
    promise = await fetch(uid);
    console.log(promise);
  });
  onDestroy(() => unSubscribe);

  const filterHandle = async () => {
    console.log(filterMonth);
    promise = await fetch(uid, filterMonth);
  };
</script>

{#if !uid}
  <Button on:click={signInWithGoogle} class="text-white-900 mt-10"
    >ログイン</Button
  >
{:else}
  <section>
    <h5>日記を書いた月で検索</h5>
    <TextField type="month" bind:value={filterMonth} on:change={filterHandle} />
  </section>
  {#await promise}
    <p class="mt-10 flex justify-center">
      <ProgressCircular />
    </p>
  {:then diaries}
    {#if diaries.length > 0}
      <Router>
        {#each diaries as d}
          <Link to={'/diary/' + d.id} class="flex items-center mb-6">
            <aside class="diary-aside">
              <p class="text-left">
                {dayjs(d.createdAt).format('YYYY年MM月DD日')}
              </p>
              <img
                src={d.image ? d.image : '/dummy.jpeg'}
                alt="diary"
                class="diary-image"
              />
              <p>
                <StarRating rating={d.rate / 2} />
              </p>
            </aside>
            <p>{d.body}</p>
          </Link>
        {/each}
      </Router>
    {:else}
      <p>日記が見つかりませんでした。。。</p>
    {/if}
  {/await}
{/if}

<style>
  .diary-aside {
    width: 40%;
    margin-right: '1rem';
  }
  .diary-image {
    width: 100%;
  }
</style>
