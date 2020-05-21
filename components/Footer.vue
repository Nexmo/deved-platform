<template>
  <footer class="Vlt-footer Vlt-bg-black Vlt-white">
    <div class="Vlt-container">
      <div class="Vlt-grid">
        <div class="Vlt-col">
          <h2><img src="../node_modules/@vonagevolta/volta2/images/logos/Vonage-wordmark--white.svg" width="100" /></h2>
          <ul>
            <li><a class="Vlt-text-link Vlt-white" href="https://www.vonage.com/legal/" target="_blank">Legal</a></li>
            <li><a class="Vlt-text-link Vlt-white" href="https://www.vonage.com/legal/privacy-policy/" target="_blank">Privacy</a></li>
            <li><a class="Vlt-text-link Vlt-white" href="https://www.vonage.com/copyright-policy" target="_blank">Copyright</a></li>
            <li><a class="Vlt-text-link Vlt-white" href="https://www.vonage.com/content/vonage/language-masters/en/about-us/patents" target="_blank">Patents</a></li>
          </ul>
        </div>
        <div class="Vlt-col">
          <h2>Service</h2>
          <ul>
            <li><a class="Vlt-text-link Vlt-white" href="https://www.vonage.com/partners/" target="_blank">Partners</a></li>
            <li><a class="Vlt-text-link Vlt-white" href="https://www.vonage.com/system-status/" target="_blank">System status</a></li>
            <li><a class="Vlt-text-link Vlt-white" href="https://www.vonage.com/support/" target="_blank">Support</a></li>
            <li><a class="Vlt-text-link Vlt-white" href="https://rewards.vonagebusiness.com/index.html" target="_blank">Referrals</a></li>
          </ul>
        </div>
        <div class="Vlt-col">
          <h2>Corporate</h2>
          <ul>
            <li><a class="Vlt-text-link Vlt-white" href="https://ir.vonage.com/" target="_blank">Investors</a></li>
            <li><a class="Vlt-text-link Vlt-white" href="https://www.vonage.com/events/?icmp=footer_corporate_events" target="_blank">Events</a></li>
            <li><a class="Vlt-text-link Vlt-white" href="https://www.vonage.com/careers/?icmp=footer_corporate_careers" target="_blank">Careers</a></li>
          </ul>
        </div>
        <div class="Vlt-col">
          <h2>Social</h2>
          <ul>
            <li>
              <a class="Vlt-text-link Vlt-white" href="https://facebook.com/vonage" target="_blank">Facebook</a>
            </li>
            <li>
              <a class="Vlt-text-link Vlt-white" href="https://www.linkedin.com/company/vonage" target="_blank">LinkedIn</a>
            </li>
            <li>
              <a class="Vlt-text-link Vlt-white" href="https://twitter.com/Vonage" target="_blank">Twitter</a>
            </li>
            <li>
              <a class="Vlt-text-link Vlt-white" href="https://www.youtube.com/channel/UCHQnbTiun_Wn7nDxkQavrYQ" target="_blank">YouTube</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  computed: {
    year() {
      return new Date().getFullYear()
    }
  }
}
</script>

<style scoped>
.Vlt-footer {
  width: 100vw;
  min-height: 200px;
  margin-top: 50px;
  padding: 50px 0;
}
.Vlt-container {
  margin: auto;
  padding: 12px;
}

.Vlt-footer h2 {
  color: white;
  text-transform: uppercase;
  color: #868994;
  margin-bottom: 1rem;
  font-size: 1.4rem;
  font-weight: 500;
  letter-spacing: .2rem;
}
</style>
