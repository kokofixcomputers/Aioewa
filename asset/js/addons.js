// const arrows = document.querySelectorAll(".arrow")
// arrows.forEach((e)=>{
//     // document.createElement("div")
//     e.addEventListener("pointerdown", (a)=>{
//         e.parentElement.classList.contains("active") ? e.parentElement.classList.remove("active") : e.parentElement.classList.add("active")
//     })

// })

const addon = {
    createElement(_name, _description, _id) {
        let rem = document.createElement("div");
        rem.insertAdjacentHTML("beforeend", `
    <div class="addon addon-${_id}">
        <label tabindex="0"  class="arrow"><input tabindex="-1" type="checkbox"></label>
        <h3>${_name}</h3>
        <div class="content">${_description}</div>
        <label tabindex="0"  class="switch"><input tabindex="-1" type="checkbox"></label>
    </div>
        `)
        rem = rem.querySelector(".addon")
        return rem
    },
    createSettings(_id, {_enabled = false, _name} = {}) {
        let rem = {
            id: _id
        }
        rem.enabled = _enabled
        _name != undefined ? rem.name = _name : undefined
        return rem
    },
    createFullDefaultSettings(_addons) {

    }
}
// console.log(createAddonSettings("a", {_name: "hello there"}))
const info = []
await new Promise(async (resolve, reject) => {  
    const addons = await(await aw.getJSON(chrome.runtime.getURL("../../addon/addon.json")))
    addons.forEach(async (e)=>{
        info.push(await aw.getJSON(chrome.runtime.getURL(`../../addon/${e}/info.json`)))
        if(e == addons[addons.length-1]) {
            resolve(true)
        }
    })
})

let elements = {}
info.forEach(async (e)=>{
    const rem = addon.createElement(e.name, e.description, e.id)
    document.body.append(rem)

    const label = rem.querySelector(".switch")
    const input = label.querySelector("input")
    elements[e.id] = {elm: rem, label: label, input: input}
    if (await(await chrome.storage.sync.get(null))[`${e.id}`] == undefined) {
        chrome.storage.sync.set({[`${e.id}`]: addon.createSettings(e.id, {_name: e.name})})
    }
    input.checked = await(await chrome.storage.sync.get(null))[`${e.id}`].enabled
    
    label.addEventListener("change", (a)=>{
        // console.log(a)
        chrome.storage.sync.set({[`${e.id}`]: addon.createSettings(e.id, {_name: e.name, _enabled: input.checked})})
    })
})
chrome.storage.sync.onChanged.addListener((e)=>{
    const rem = Object.values(e)[0]
    elements[Object.keys(e)[0]] != undefined ? elements[rem.newValue.id].input.checked = rem.newValue.enabled : undefined
})

// const label = document.querySelectorAll(".addon label")
// let div = document.createElement("label")
// label.forEach((e)=>{
//     div.addEventListener("keydown", (a)=>{
//         console.log(e)
//         if (a.key == " " || a.key == "Enter") {
//             e.querySelector("input").checked ? e.querySelector("input").checked = false : e.querySelector("input").checked = true 
//         }
//     })
// })