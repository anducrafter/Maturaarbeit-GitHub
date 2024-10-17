function timeleft(milliseconds,uuid) {
    milliseconds = parseInt(milliseconds);
            const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
            if(milliseconds - Date.now() <= 0)return "Auktion beendet am " + new Date((milliseconds)).toLocaleDateString(undefined,options);
          
            if ( milliseconds - Date.now() > 86400000) return new Date(milliseconds).toLocaleDateString(undefined, options);
            
            const now = Date.now();
            const remainingTime = milliseconds - now;
            let h = Math.floor(remainingTime / 3600000);
            let m = Math.floor((remainingTime % 3600000) / 60000);
            let s = Math.floor((remainingTime % 60000) / 1000);
            return `${h} Stunden ${m} Minuten ${s} Sekunden`;
        }
        function setTime(milliseconds,uuid){
            const timerElement = document.getElementById(`timer-`+uuid);
            timerElement.innerText =timeleft(milliseconds,uuid)
            const countdown = setInterval(() => {
              
              if ((milliseconds - Date.now()) < 0) {
                        clearInterval(countdown);
                        timerElement.innerText = timeleft(milliseconds,uuid)
                    }
            
            timerElement.innerText =timeleft(milliseconds,uuid)
            },1000);
          }