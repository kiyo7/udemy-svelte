<script>
  import { onMount } from 'svelte';
  import { getDiary } from '../helpers/api';
  import dayjs from 'dayjs';

  import { Slider, TextField, Button, ProgressCircular } from 'smelte';

  export let id;
  console.log(id);
  let promise = getDiary();
  let rate, body;

  onMount(async () => {
    promise = await getDiary(id);
    rate = promise.rate;
    body = promise.body;
  });

  const submit = () => {
    console.log(promise);
  };
</script>

{#await promise}
  <p class="mt-10 flex justify-center">
    <ProgressCircular />
  </p>
{:then diary}
  <h1 class="h4">{dayjs(diary.createdAt).format('YYYY年MM月DD日')}の日記</h1>
  <form class="p-5" on:submit|preventDefault={submit}>
    <img src={diary.image ? diary.image : '/dummy.jpeg'} alt="diary" />
    <p class="mb-4">今日の気分は{rate}点です</p>
    <Slider class="mb-4" min="1" max="10" bind:value={rate} />
    <TextField
      class="bg-white-900"
      label="日記の本文(変更する場合は編集)"
      bind:value={body}
      textarea
      rows="5"
      outlined
    />
    <div class="py-2">
      <Button class="text-white-900" type="submit">日記を更新</Button>
    </div>
  </form>
{/await}
<p>Diary</p>
