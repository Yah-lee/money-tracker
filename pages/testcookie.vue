<script>
import Cookies from 'js-cookie';

export default {
  data() {
    return {
      cookieValue: null,
      object:{
        a:1,
        b:"Yah Lee"
      }
    };
  },
  created() {
    // Check if cookie exists when the component is created
    this.cookieValue = Cookies.get('myCookie'); // Replace 'myCookie' with your cookie name
  },
  methods: {
    setCookie() {
      // Set a cookie with a name, value, and expiration (optional)
      Cookies.set('myCookie', this.object, { expires: 7 }); // This cookie will expire in 7 days
      this.cookieValue = Cookies.get('myCookie');
    },
    removeCookie() {
      // Remove a cookie by its name
      Cookies.remove('myCookie');
      this.cookieValue = null;
    }
  }
};
</script>

<template>
  <div>
    <p>Cookie Value: {{ cookieValue }}</p>
    <button @click="setCookie">Set Cookie</button>
    <button @click="removeCookie">Remove Cookie</button>
  </div>
</template>
