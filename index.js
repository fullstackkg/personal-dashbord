document.body.addEventListener("load", retrieveImage())

//Retrieving photo from UnSplash 
async function retrieveImage() {
    try {
        const response = await fetch("https://apis.scrimba.com/unsplash/photos/random?orientation=landscape&query=galaxy")
        const responseData = await response.json()

        const authorName = responseData.user.name
        const image = responseData.urls.full
        console.log(image)
        document.querySelector("#author").innerText = `By: ${authorName}`
        document.body.style.backgroundImage = `url("${image}")`

    } catch (e) {
        document.body.style.backgroundImage = `url("https://images.unsplash.com/photo-1528818955841-a7f1425131b5?crop=entropy&cs=srgb&fm=jpg&ixid=M3wxNDI0NzB8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MDE1Njc1NjN8&ixlib=rb-4.0.3&q=85")`
    }
}