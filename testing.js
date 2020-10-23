var { Context } = require('./dist')

// Define Contexts
let Child = Context({
  cookies: 0,
  name: "",
  age: 0,
  happy: false,
  init(){
    this.subscribe('cookies',function(num){
      this.happy = num > 0
    })
  },
  stealCookie(){
    this.cookies = 1;
  },
  caught(){
    this.cookies = 0;
  }
})

let Parent = Context({
  name: "",
  kids: [],
  checkJar(){
    this.kids.map(kid => kid.caught())
  }
})

// Initialize 

let parent = Parent({
    name: "J",
    kids: [
      Child({
        name: "John",
        age: 10
      }),
      Child({
        name: "Jane",
        age: 12
      })
    ]
  })

  parent.subscribe('name', (x)=>{
    console.log(x)
  })
  parent.name= "HELLO"