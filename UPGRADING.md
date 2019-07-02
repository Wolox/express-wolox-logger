## Upgrading to express logger versions

### Upgrading to version 1.0.0+

* Middlewares now are exported as functions, so this is invalid:
```
app.use(expressRequestIdMiddleware);
app.use(expressMiddleware);
```
Instead, starting from 1.0.0 you should use this as functions:
```
app.use(expressRequestIdMiddleware());
app.use(expressMiddleware({ loggerFn: logger.info }));
```
