<script>
  import { Slider, TextField, Button } from 'smelte';
  import { userId } from '../store';
  import { onDestroy } from 'svelte';
  import { postDiary } from '../helpers/api';

  let rate = 5;
  let body = '';
  let image,
    preview = '';
  let uid = null;

  const unSubScribe = userId.subscribe((id) => (uid = id));

  const submit = async () => {
    if (body.length < 10) {
      alert('日記の内容は10文字以上書いてください！');
      return false;
    }

    const result = await postDiary(uid, body, rate);

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

  const onFileSelect = (e) => {
    let target = e.target.files[0];
    image = target;
    let reader = new FileReader();
    reader.readAsDataURL(target);
    reader.onload = (e) => {
      preview = e.target.result;
    };
  };
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
  {#if preview}
    <img src={preview} alt="preview" class="mb-6" />
  {/if}
  <label
    for="file-input"
    class="bg-primary-900 text-white-900 px-4 py-3 m-auto mb-6 w-4/12 block rounded"
  >
    画像を選択
  </label>
  <input
    type="file"
    accept="image/*"
    id="file-input"
    class="hidden"
    bind:this={image}
    on:change={(e) => onFileSelect(e)}
  />
  <div class="py-2">
    <Button class="text-white-900" type="submit">日記を保存</Button>
  </div>
</form>
