var { createModel, create } = require('./src/Model2')

// Define Models
// let Child = Model({
//   cookies: 0,
//   name: "",
//   age: 0,
//   happy: false,
//   init(){
//     this.subscribe('cookies',function(num){
//       this.happy = num > 0
//     })
//   },
//   stealCookie(){
//     this.cookies = 1;
//   },
//   caught(){
//     this.cookies = 0;
//   }
// })

let Parent = createModel({
  name: "",
  kids: [],
  checkJar(){
    console.log("hello")
  }
})

// Initialize 

let parent = Parent({
  name: "J",
  kids: ["Hlo"]
})

  console.log(parent.checkJar())
 console.log(Parent)
 console.log(Parent.prototype)