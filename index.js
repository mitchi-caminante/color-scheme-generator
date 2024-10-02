const schemeTypeEl = document.getElementById("scheme-type")
const colorPickerEl = document.getElementById("color-picker")
const getSchemeBtn = document.getElementById("get-scheme-btn")
const colorBlockList = document.getElementById("color-block-list")

getSchemeBtn.addEventListener("click", generateColorScheme)

function generateColorScheme() {
    const color = colorPickerEl.value.slice(1) //.slice method removes the hash that the color picker automatically adds
    const colorScheme = schemeTypeEl.value
    const url = `https://www.thecolorapi.com/scheme?hex=${color}&mode=${colorScheme}`

    showLoadingMessage(colorScheme)
    // use a timeout to show a loading message for the user
    setTimeout(() => {
        // Fetch the color scheme data
        fetch(url)
            .then(res => res.json())
            .then(data => {
                const html = data.colors.map(color => createColorHtmlEl(color.hex.value)).join('')
                colorBlockList.innerHTML = html
                addCopyFunctionality()
            })
            .catch(error => {
                console.error('Error fetching color scheme', error)
                cshowError("Failed to generate color scheme. Please try again.")
            })
    }, 1000);
}

function createColorHtmlEl(hexValue) {
    return `
        <li class="color-block" style="background-color:${hexValue};" tabindex="0" aria-label="copy color ${hexValue}">
            <p class="hex-value-text-disp">${hexValue}</p>
            <div class="hover-text">Click to copy to clipboard</div>
        </li>`
}

function showLoadingMessage(colorScheme) {
    const loadingMsgHtml = `
        <div class="loading-msg" id="loading-message" aria-live="assertive">Generating ${colorScheme} color scheme....</div>
    `;   
    colorBlockList.innerHTML = loadingMsgHtml
}

// Show error message
function showError(message) {
    const errorHtml = `<div class="loading-msg" aria-live="assertive">${message}</div>`
    colorBlockList.innerHTML = errorHtml; // Update the list with the error message
}

// Add click & keyboard functionality to copy the hex color to the clipboard
function addCopyFunctionality() {
    const colorBlocks = document.querySelectorAll('.color-block')
    colorBlocks.forEach(block => {
        block.addEventListener('click', copyColorToClipboard)
        block.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                copyColorToClipboard(event)
            }
        })
    })
}

// Function to copy color
function copyColorToClipboard(event) {
    const hexValue = event.target.textContent.trim() 
    navigator.clipboard.writeText(hexValue).then(() => {
        alert(`Copied ${hexValue} to clipboard!`) 
    }).catch(err => {
        console.error('Failed to copy: ', err)
    })
}


