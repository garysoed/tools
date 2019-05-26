# Immutable

Generates an immutable factory based on a given spec.

The given spec must be a class that takes in a `Serializable` object. The spec must consist of
getters and setters. The getters must return values from the serializable object, and the setters
must modify the serializable object.

The factory can be used to generated immutable objects based on a `Serializable` object. The
generated immutable object will have the getters defined in the spec, and two additional methods:

-   `$set`: Returns an object with methods to set properties, each corresponding to a setter
    defined in the spec. Each setter takes in the new value and returns an object that needs to be
    passed to the `$update` method to update the immutble object.
-   `$update`: Takes in multiple objects returned by the setter methods returned by `$set` and
    returns an object with the updates applied.
