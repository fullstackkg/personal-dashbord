document.body.addEventListener("load", retrieveImage())

//Retrieving photo from UnSplash 
function retrieveImage() {
    fetch("https://apis.scrimba.com/unsplash/photos/random?orientation=landscape&query=galaxy")
    .then(res => res.json())
    .then(data => {
        const authorName = data.user.name
        const image = data.urls.full
        const p = document.createElement("p")
        p.innerText = authorName
        document.body.append(p)
        document.body.style.backgroundImage = `url("${image}")`
    })
}