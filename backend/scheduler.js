const cron = require('node-cron');
const axios = require('axios');

// Run every 12 hours (at midnight and noon)
const contestFetcherCron = () => {
  cron.schedule('0 */12 * * *', async () => {
    console.log('⏰ Running scheduled contest fetch (every 12 hours)...');
    
    try {
      const res = await axios.get('https://contesthub1-server.onrender.comapi/contests/dashboard');
      
      if (res.status === 200) {
        console.log(`✅ Fetched contests via API: ${res.data.msg || 'Success'}`);
      } else {
        console.error(`⚠️ Scheduler responded with status: ${res.status}`);
      }
    } catch (error) {
      console.error('❌ Error fetching contests in scheduler:', error.message);
    }
  });
};


module.exports = contestFetcherCron;
