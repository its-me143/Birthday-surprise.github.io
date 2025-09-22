const flame = document.querySelector('.flame');
const popup = document.getElementById('popup');
const song = document.getElementById('birthdaySong');
const bgMusic = document.getElementById('bgMusic');
const message = document.querySelector(".message");
const cakeTop = document.querySelector(".cake-top");

window.onload = function() {
  popup.style.display = "block";
  document.getElementById("startBtn").addEventListener("click", () => {
    popup.style.display = "none";
    bgMusic.play();
    startBlowDetection();
  });
};

async function startBlowDetection() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    source.connect(analyser);
    const dataArray = new Uint8Array(analyser.fftSize);

    function detectBlow() {
      analyser.getByteTimeDomainData(dataArray);
      let sum = 0;
      for(let i=0;i<dataArray.length;i++){
        let value=(dataArray[i]-128)/128;
        sum+=value*value;
      }
      const volume = Math.sqrt(sum/dataArray.length);
      if(volume>0.05){
        flame.style.display="none";
        bgMusic.pause();
        song.play();
        popup.innerHTML = `<p>🎂 Presiona la capa superior del pastel 🎂</p>`;
        popup.style.display = "block";
        cakeTop.classList.add("clickable");
        return;
      }
      requestAnimationFrame(detectBlow);
    }
    detectBlow();
  } catch(err) {
    console.error("Microphone error:", err);
    popup.innerText = "Por favor, habilita el micrófono 🎤";
    popup.style.display = "block";
  }
}

cakeTop.addEventListener("click", () => {
  if(cakeTop.classList.contains("clickable") && !cakeTop.classList.contains("open")){
    popup.style.display="none";
    openCakeOnce();
  }
});

function openCakeOnce() {
  cakeTop.classList.add("open");
  setTimeout(()=>{ message.classList.add("show"); },800);
  triggerFireworks();
}

function triggerFireworks() {
  const fireworks = document.querySelectorAll('.fireworks1,.fireworks2,.fireworks3,.fireworks4,.fireworks5');
  const cheering = document.getElementById("cheering");
  const colors=["#0ff","#f0f","#ff0","#0f0","#f80","#08f"];
  let count=0;
  const interval = setInterval(()=>{
    fireworks.forEach(fw=>{
      const x=Math.random()*window.innerWidth;
      const y=Math.random()*window.innerHeight;
      const color=colors[Math.floor(Math.random()*colors.length)];
      fw.style.left=`${x}px`;
      fw.style.top=`${y}px`;
      fw.style.boxShadow=`0 0 10px ${color}, 0 0 20px ${color}, 0 0 40px ${color}`;
      fw.style.display="block";
      fw.style.animation="none";
      void fw.offsetWidth;
      fw.style.animation="explode 1s ease-out forwards";
    });
    count++;
    if(count>6){ clearInterval(interval); cheering.play(); }
  },1000);
}
