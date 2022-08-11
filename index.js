let btn = document.querySelector("#button")
let startMouseY = 0
let mousePosY = 0
let grapping = false
let grappingEl
let loopFrame
let numberInput = [5, 5, 5, 5]
let curTrans

// solve for given combination
let solve = (num) => {

    let nums = num.toString().split("")
    let comb = combinations(nums)
    let oprs = ["+", "-", "*", "/"]

    for (let x = 0; x < comb.length; x++) {

        let ans = ""

        for (let i = 0; i < oprs.length; i++) {

            for (let j = 0; j < oprs.length; j++) {

                for (let k = 0; k < oprs.length; k++) {

                    for (let l = 0; l < nums.length; l++) {

                        ans += comb[x][l]

                        if (l == 0) ans += oprs[i]
                        if (l == 1) ans += oprs[j]
                        if (l == 2) ans += oprs[k]

                    }

                    let split = ans.split("")

                    for (let m = 0; m < 6; m++) {

                        let s = [...split]

                        if (m == 0) {
                            ans = split.join("")
                        }

                        if (m == 1) {
                            s.splice(3, 0, ")")
                            s.splice(0, 0, "(")
                            ans = s.join("")
                        }

                        if (m == 2) {
                            s.splice(5, 0, ")")
                            s.splice(0, 0, "(")
                            ans = s.join("")
                        }

                        if (m == 3) {
                            s.splice(5, 0, ")")
                            s.splice(2, 0, "(")
                            ans = s.join("")
                        }

                        if (m == 4) {
                            s.splice(7, 0, ")")
                            s.splice(2, 0, "(")
                            ans = s.join("")
                        }

                        if (m == 5) {
                            s.splice(7, 0, ")")
                            s.splice(4, 0, "(")
                            ans = s.join("")
                        }

                        let mathAns = math.evaluate(ans)
                        let printAns = ans.replace("-", "–").replace("*", "×").replace("/", "÷")
                        let print = `${printAns}=${mathAns}`
                        if (mathAns == 10) return print

                        ans = ""
                    }

                }

            }

        }

    }

    return "unable to solve"

}

// utility function for shuffling array into all possible combinations
function combinations(arr) {
    var output = [];
    var n = arr.length;
    var ways = [];
    for (var i = 0, j = 1; i < n; ways.push(j *= ++i));
    var totalWays = ways.pop();
    for (var i = 0; i < totalWays; i++) {
        var copy = arr.slice();
        output[i] = [];
        for (var k = ways.length - 1; k >= 0; k--) {
            var c = Math.floor(i / ways[k]) % (k + 2);
            output[i].push(copy.splice(c, 1)[0]);
        }
        output[i].push(copy[0]);
    }
    return output;
}

// build numbers into HTML
let initNumbers = () => {
    for (let i = 0; i < 4; i++) {
        let numberContainer = document.createElement("div")
        numberContainer.classList.add("number_container")
        numberContainer.dataset.index = i
        numberContainer.style.transform = "translateY(-240px)"
        for (let j = 0; j < 10; j++) {
            let number = document.createElement("p")
            number.classList.add("number")
            number.dataset.number = (j - 1) % 10
            number.textContent = (j + 99) % 10
            numberContainer.append(number)
        }
        document.querySelector("#number_wrapper").append(numberContainer)
    }
}
initNumbers()

// run this loop when moving carrousel
let moving = () => {

    let transPos = +curTrans + mousePosY - startMouseY
    let height = document.querySelectorAll(".number")[0].clientHeight + 2

    grappingEl.style.transform = `translateY(${transPos}px)`

    let grapNums = grappingEl.querySelectorAll(".number")
    for (let i = 0; i < grapNums.length; i++) {
        let num = grapNums[i]
        let numOther = num.dataset.number - 5
        let rotations = Math.floor((numOther * height + transPos) / (height * -10))
        let numPos = (rotations * height * 10)
        num.style.transform = `translateY(${numPos}px)`
    }

    if (grapping) {
        requestAnimationFrame(moving)
    } else {
        cancelAnimationFrame(loopFrame)
        grappingEl.style.transform = `translateY(${Math.round(transPos / height) * height}px)`

        let result = Math.round(-transPos / height + 1000) % 10
        numberInput[grappingEl.dataset.index] = result

        console.log(numberInput)
    }

}

// when user touches numbers
let startOfTouch = (el, event, touch) => {
    grapping = true
    grappingEl = el
    if (touch) mousePosY = event.touches[0].screenY
    startMouseY = mousePosY
    console.log(startMouseY)
    curTrans = el.style.transform.split("(")[1].split("px")[0]
    document.documentElement.style.cursor = "grabbing"
    loopFrame = requestAnimationFrame(moving)
}

// when user stops touching numbers
let endOfTouch = () => {
    console.log("release")
    document.documentElement.style.cursor = "auto"
    grapping = false
}

let numContainer = document.querySelectorAll(".number_container")

numContainer.forEach((el) => {
    el.addEventListener("mousedown", (event) => startOfTouch(el, event, false))
    el.addEventListener("touchstart", (event) => startOfTouch(el, event, true))
})

let handleMousemove = (event) => mousePosY = event.y || event.touches[0].screenY

document.addEventListener("mousemove", handleMousemove);
document.addEventListener("touchmove", handleMousemove);

document.addEventListener("mouseup", endOfTouch)
document.addEventListener("touchend", endOfTouch)

// solve on button click
btn.addEventListener("click", () => {
    let title = document.querySelector("#title")
    title.textContent = " "
    setTimeout(() => {
        title.textContent = solve(numberInput.join(""))
    }, 100)
})

const appHeight = () => {
    const doc = document.querySelector("body")
    doc.style.setProperty('--app-height', `${window.innerHeight}px`)
}

window.addEventListener("resize", () => {
    appHeight()
    setTimeout(() => {
        appHeight()
    }, 500)
})

appHeight()