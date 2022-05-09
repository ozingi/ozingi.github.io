const vids = [
    {
        class:"hero__video",
        src:"https://www.pepsi.com/en-us/uploads/media/PepsiWildCherry.Copier.15.mp4", 
        type: "video/mp4",
        poster: "https://www.pepsi.com/en-us/uploads/media/Cherry-Copier.png",
        autoplay: true,
        loop: true,
        playsinline: true,
        muted: true
    },
    {
        class: "hero__video",
        src: "https://www.pepsi.com/en-us/uploads/media/PepsiVanilla.Ribbon-new.mp4",
        type: "video/mp4",
        poster:"https://www.pepsi.com/en-us/uploads/media/Vanilla-Ribbon.png",
        autoplay: true,
        loop: true,
        playsinline: true,
        muted: true
    }
]

const containers = document.querySelectorAll(".hero__video-container")

for(i=0; i<containers.length; i++){
    let video = vids[i]
    containers[i].innerHTML = `<video controls controlsList="nodownload noremoteplayback" class=${video.class} kind="captions" type=${video.type} src=${video.src} poster=${video.poster} autoplay=${video.autoplay} loop=${video.loop} playsinline=${video.playsinline} muted=${video.muted} />`
}