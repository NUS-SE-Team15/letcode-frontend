<template>
  <div class="about-me">
    <h1>About Us</h1>
    <p>{{ authorInfo.name }}</p>
    <p>{{ authorInfo.us }}</p>
    <p>{{ authorInfo.bio }}</p>
  </div>
</template>

<script>
export default {
  name: "AboutMe",
  data() {
    return {
      authorInfo: {
        projname: "LetCode",
        us: "NUS ISS SE Team15",
        bio: "A passionate dev team having interest in Software Engineering",
      },
    };
  },
};
</script>

<style scoped>
.about-me {
  font-family: Arial, sans-serif;
  text-align: center;
  padding: 20px;
}

h1 {
  color: #333;
}

p {
  color: #666;
  font-size: 16px;
}
</style>
