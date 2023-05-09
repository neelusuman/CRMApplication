let boss = async function(){
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
        
 let promise1= new Promise(func1);
 let promise2 = new Promise(func2);
 await promise1 , promise2
 console.log("Both cmpleted",promise1,promise2)
}