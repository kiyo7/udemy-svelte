<script>
  import { Slider, TextField, Button } from 'smelte';
  import { userId } from '../store';
  import { onDestroy } from 'svelte';
  import { postDiary } from '../helpers/api';

  let rate = 5;
  let body = '';
  let uid = null;

  const unSubScribe = userId.subscribe((id) => (uid = id));

  const submit = () => {
    if (body.length < 10) {
      alert('日記の内容は10文字以上書いてください！');
      return false;
    }
    const result = postDiary(uid, body, rate);

    console.log(result);

    if (!result) {
      alert('日記の追加は失敗しました。');
    } else {
      alert('日記が保存されました!');
      document.location.href = '/';
    }
  };

  onDestroy(() => {
    unSubScribe;
  });
</script>

<h3>日記を書こう</h3>
<form class="p-5" on:submit|preventDefault={submit}>
  <p class="mb-4">今日の気分は{rate}点です</p>
  <Slider class="mb-4" min="1" max="10" bind:value={rate} />
  <TextField
    class="bg-white-900"
    label="日記の本文"
    bind:value={body}
    textarea
    rows="5"
    outlined
  />
  <div class="py-2">
    <Button class="text-white-900" type="submit">日記を保存</Button>
  </div>
</form>
