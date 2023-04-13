/**
 * Checks if value is an empty collection.
 * Objects are considered empty if they have no own enumerable string keyed properties.
 * Array, String are considered empty if they have Zero length
 * Falsey values are empty.
 * @param {*} collection The value to check.
 * @returns {boolean} Returns `true` if `value` is empty, else `false`.
 */

 export default function isEmpty(collection){
  if(collection){
     return  collection.constructor === Object  
        ?!Object.keys(collection).length > 0 : !collection.length > 0
  }
      return true;
}