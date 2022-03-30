<script>
  import { onMount } from 'svelte';
  import { getDiary, updateDiary, deleteDiary } from '../helpers/api';
  import dayjs from 'dayjs';

  import { Slider, TextField, Button, ProgressCircular } from 'smelte';

  export let id;
  let promise = getDiary();
  let rate, body, image, preview;

  onMount(async () => {
    promise = await getDiary(id);
    rate = promise.rate;
    body = promise.body;
  });

  const submit = async () => {
    const returnValue = await updateDiary(id, body, rate, image);
    if (returnValue) {
      alert('日記の更新が完了しました。');
      location.href = '/';
    } else {
      alert('更新ができませんでした。やり直してください');
      location.href = '/';
    }
  };
  const onFileSelect = (e) => {
    let target = e.target.files[0];
    image = target;
    let reader = new FileReader();
    reader.readAsDataURL(target);
    reader.onload = (e) => {
      preview = e.target.result;
    };
  };

  const deleteHandle = async () => {
    const result = await deleteDiary(id);
    if (result) {
      alert('日記の削除が完了しました');
      location.href = '/';
    } else {
      alert(
        '日記の削除ができませんでした。通信環境の良い所で再度お試しください'
      );
      location.href = '/';
    }
  };
</script>

{#await promise}
  <p class="mt-10 flex justify-center">
    <ProgressCircular />
  </p>
{:then diary}
  <h1 class="h4">{dayjs(diary.createdAt).format('YYYY年MM月DD日')}の日記</h1>
  <form class="p-5 mb-10" on:submit|preventDefault={submit}>
    {#if !preview}
      <img
        class="mb-4"
        src={diary.image ? diary.image : '/dummy.jpeg'}
        alt="diary"
      />
    {:else}
      <img class="mb-4" src={preview} alt="diary" />
    {/if}
    <label
      for="file-input"
      class="bg-primary-900 text-white-900 px-4 py-3 m-auto mb-6 w-4/12 block rounded dark:bg-accent-900"
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
      <Button class="text-white-900 dark:bg-accent-900" type="submit"
        >日記を更新</Button
      >
    </div>
  </form>
  <Button
    class="bg-alert-900 text-white-900 mb-10 dark:bg-alert-600 dark-hover:bg-dark-700"
    on:click={deleteHandle}>日記を削除</Button
  >
{/await}
