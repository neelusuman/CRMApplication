// const show= function(i){
//     console.log(i)
// }


// for(let i=0; i<10; i++){
//     setTimeout(show, i * 1000,i)
// }
let func1 = function(resolve, reject){
setTimeout(function(){
    console.log('in setTimeout callback1')
    resolve(5)
},5000)
}
let func2 = function(resolve, reject){
    setTimeout(function(){
        console.log('in setTimeout callback2')
        resolve(3)
    },3000)
    }

    let promise =[new Promise(func1), new Promise(func2)]

    Promise.all(promise).then(arr=>console.log(arr))