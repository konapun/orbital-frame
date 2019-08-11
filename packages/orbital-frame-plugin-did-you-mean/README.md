# @orbital-frame/plugin-did-you-mean
List possible intended command names upon receiving an invalid command

```
> @jehuty hlep
Did you mean:
    help
```

## Runtime Complexity
This plugin uses Damerau-Levenshtein distance as its similarity measure which
has a runtime complexity of O(n*m), where n and m are the lengths of the strings
being compared. This is applied against every loaded command on error which
gives a final runtime complexity of ~O(n^2) which may introduce significant
overhead if there are many commands loaded.
