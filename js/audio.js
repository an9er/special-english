var audioEl,
    titleEl,
    timeEl,
    rangeEl,
    playEl,
    volumeEl;

function initAudio(){
    var _audio;
    if(audioEl){ return; }
    if(window["Audio"] && (_audio=new Audio()).canPlayType('audio/mpeg')){
        _audio.addEventListener('canplay', onCanPlay, false);
        _audio.addEventListener('play', onPlay, false);
        _audio.addEventListener('pause', onPause, false);
        _audio.addEventListener('ended', onEnded, false);
        _audio.addEventListener('error', onError, false);
        _audio.addEventListener('timeupdate', onTimeUpdate, false);
        _audio.volume=0.5;
        document.getElementById("container").appendChild(_audio);

        audioEl = _audio;
        titleEl = document.getElementById('title');
        timeEl = document.getElementById('time');
        rangeEl = document.getElementById('range');
        playEl = document.getElementById('play');
        volumeEl = document.getElementById('volume');

        volumeEl.addEventListener('change', onVolumeChange, false);
        rangeEl.addEventListener('change', onRangeChange, false);
        playEl.addEventListener('click', onPlayButtonClick, false);
    }
}

function loadAudio(url, title){
    if(!audioEl){ return; }
    var name = title || url.replace(/^.*\//,'').replace(/[#\?].*$/,'') || 'Unknown';
    titleEl.innerHTML = name;
    rangeEl.value = 0;
    rangeEl.disabled = true;
    timeEl.innerHTML = '--:-- / --:--';
    playEl.innerHTML = '加载中';
    audioEl.autoplay = true;
    audioEl.src = url;
    // audioEl.load();
}

function onCanPlay(){
    rangeEl.disabled = false;
}

function onPlay(){
    playEl.innerHTML='暂停';
}

function onPause(){
    playEl.innerHTML='播放';
}

function onEnded(){
    audioEl.pause();
    audioEl.currentTime = 0;
}

function onError(){
    rangeEl.disabled = true;
    titleEl.innerHTML = '<span style="color:red">加载错误:'+titleEl.innerHTML+'</span>';titleEl.innerHTML='<span style=""'
    playEl.innerHTML = '已停止';
}

function onTimeUpdate(){
    var pos = audioEl.currentTime,
        dora = audioEl.duration;
    timeEl.innerHTML = formatTime(pos) + ' / ' + formatTime(dora);
    // console.info(pos, dora);
    if(isFinite(dora) && dora > 0){
        rangeEl.value = pos/dora
    }
}

function onVolumeChange(){
    if(!audioEl){ return; }
    audioEl.volume = volumeEl.value;
}

function onRangeChange(){
    if(!audioEl){ return; }
    var buf=audioEl.buffered.length?audioEl.buffered.end(0):0,
        dora=audioEl.duration;
    if(isFinite(dora) && dora > 0){
        var value = rangeEl.value,
            pos = value * dora;
            if(pos > buf){
                pos = buf;
            }
        audioEl.currentTime = pos;
    }
}

function onPlayButtonClick(){
     if(!audioEl){ return; }
     if(audioEl.error){
         return;
     }else if(audioEl.readyState<2){
         audioEl.autoplay = true;
     }else if(audioEl.paused){
         audioEl.play();
     }else{
         audioEl.pause();
     }
}

function formatTime(sec){
    if(!isFinite(sec) || sec<0){
        return '--:--';
    }else{
        var m=Math.floor(sec/60),
            s=Math.floor(sec)%60;
        return (m<10?'0'+m:m)+':'+(s<10?'0'+s:s);
    }
}

function hotkey()
{
    var a=window.event.keyCode;
    console.info(a);
    if(a==32){
        onPlayButtonClick()
    }else if(a==188){
        audioEl.currentTime -= 6;
    }
    // if((a==65)&&(event.ctrlKey)){
    //     alert("你按了ctrl+a键吧");
    // }
}// end hotkey

document.onkeydown = hotkey; //当onkeydown 事件发生时调用hotkey函数
initAudio();
loadAudio("mp3/chinese-companies-fight-for-data-storage-business.mp3", "chinese-companies-fight-for-data-storage-business");
