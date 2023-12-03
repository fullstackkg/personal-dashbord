document.body.addEventListener("load", retrieveImage())

//Retrieving photo from UnSplash 
async function retrieveImage() {
    try {
        const response = await fetch("https://apis.scrimba.com/unsplash/photos/random?orientation=landscape&query=galaxy")
        const responseData = await response.json()
        console.log(responseData)

        const authorName = responseData.user.name
        const image = responseData.urls.full
        document.querySelector("#author").innerText = `By: ${authorName}`
        document.body.style.backgroundImage = `url("${image}")`

    } catch (e) {
        console.error(e)
    }
}