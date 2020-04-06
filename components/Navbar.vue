<template>
  <div class="navbar">
    <nuxt-link to="/users">
      <img
        src="https://img.icons8.com/material-outlined/24/000000/user--v1.png"
      />
    </nuxt-link>
  </div>
</template>

<style>
.navbar {
  box-shadow: 2px 0px 16px #000;
  z-index: 1000;
  height: 4em;
  background: #60ebd2;
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  padding: 0em 2em 0em 2em;
}
</style>
