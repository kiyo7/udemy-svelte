<script>
  import { onDestroy } from 'svelte';
  import { Router, Link } from 'svelte-routing';
  import { userId } from '../store';
  let uid;

  const unSubscribe = userId.subscribe((id) => {
    uid = id;
  });
  onDestroy(() => unSubscribe());
</script>

<footer class="bg-secondary-900  flex items-center justify-around">
  <Router>
    <Link class="block mb-3" to="/">Home</Link>
    <Link class="block mb-3" to="about">日記の効果とは？</Link>
    {#if uid}
      <Link class="block mb-3" to="create">日記を書く</Link>
    {/if}
  </Router>
</footer>

<style>
  footer {
    height: 60px;
  }
</style>
