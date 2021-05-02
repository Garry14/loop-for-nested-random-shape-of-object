```javascript
// Its The Random Nested Object
const nested = {
    obj1: {
        name: 'John Doe',
        age: 45,
        nested1: {
            nested_name: 'John Doe Nest',
            nested_age: 34
        },
        nestedArray1: [
            {
                nested_name_array: 'John Doe Nest Array',
                nested_age_array: 34
            },
            {
                nested_name_array: 'John Doe Nest Array 2',
                nested_age_array: 34
            }
        ],
        someobject: 'Blah',
        its_object: {
            key1: [
                {
                    uuid: '987234lhj23l',
                    random_text: 'Blah random'
                }
            ]
        }
    }
}

const theArr = []
const getImageSrc = (object, ke=1) => {

    // Try to search anything valur from The Random Nested Object
    const searchVal = "John Doe Nest Array 2"

    if (typeof object !== "undefined") {
        if (object) {
            for (let theProp=0; theProp < Object.keys(object).length; theProp++) {
                // You can check the nodes by console.log here: console.log(typeof object[Object.keys(object)[theProp]], Object.keys(object)[theProp], 'ke => ', ke)
                if (typeof object[Object.keys(object)[theProp]] === "object") {
                    ke++
                    if (Array.isArray(object[Object.keys(object)[theProp]])) { 
                        if (object[Object.keys(object)[theProp]].length > 0) {
                            object[Object.keys(object)[theProp]].map(nd => {
                                getImageSrc(nd, ke) 
                            })
                        }  
                    } else {
                        getImageSrc(object[Object.keys(object)[theProp]], ke)
                    }
                } else  {
                    if (object[Object.keys(object)[theProp]] === searchVal && !theArr.includes(searchVal)) {
                        theArr.push(searchVal)
                    }
                }
            }
        }
    }
    // You can return the array here
    console.log(theArr)
}
```
