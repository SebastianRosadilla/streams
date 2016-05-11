function Permissions() {

  /**
   * @param {object} object - object to change.
   *
   * @desc turn off writable, enumerable and configurable
   *       to each object property.
   *
   * @author Alfredo Sebastian Rosadilla Ribeiro.
   */
  Permissions.prototype.disablePermissions = (object) => {
    for (let property in object) {
      if (object.hasOwnProperty(property)) {
        Object.defineProperty(
          object, object[property],
          {
            writable: false,
            enumerable: false,
            configurable: true
          }
        )
      }
    }
  }

  /**
   * @param {object} object - object to change.
   *
   * @desc turn on writable, enumerable and configurable
   *       to each object property.
   *
   * @author Alfredo Sebastian Rosadilla Ribeiro.
   */
  Permissions.prototype.allowPermissions = (object) => {
    for (let property in object) {
      Object.defineProperty(
        object, object[property],
        {
          writable: true,
          enumerable: true,
          configurable: true
        }
      )
    }
  }

  /**
   * @param {object} object - object to change.
   * @param {string} property - represent the name of
   *        object property to change.
   *
   * @desc switch writable state to object 'property'.
   *
   * @author Alfredo Sebastian Rosadilla Ribeiro.
   */
  Permissions.prototype.changeWritable = (object, property) => {
    changeProperty(object, property, 'writable');
  }

  /**
   * @param {object} object - object to change.
   * @param {string} property - represent the name of
   *        object property to change.
   *
   * @desc switch enumerable state to object 'property'.
   *
   * @author Alfredo Sebastian Rosadilla Ribeiro.
   */
  Permissions.prototype.changeEnumerable = (object, property) => {
    changeProperty(object, property, 'enumerable');
  }

  /**
   * @param {object} object - object to change
   * @param {string} property - represent the name of
   *        object property to change.
   *
   * @desc switch configurable state to object 'property'.
   * 
   * @author Alfredo Sebastian Rosadilla Ribeiro.
   */
  Permissions.prototype.changeConfigurable = (object, property) => {
    changeProperty(object, property, 'configurable');
  }

  //--------------------------- private functions ---------------------------//

  let changeProperty = (object, property, key) => {
    let properties = {
      writable: object.propertyIsWritable(object[property]),
      enumerable: object.propertyIsEnumerable(object[property]),
      configurable: object.propertyIsConfigurable(object[property])
    }

    properties[key] = !properties[key];

    Object.defineProperty(object, object[property], properties);
  }

  //--------------------------- private functions ---------------------------//

  return Permissions.prototype;
}

export default {
  name: 'Permissions',
  fn: Permissions
};
