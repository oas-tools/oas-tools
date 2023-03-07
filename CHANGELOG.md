# [3.1.0](https://github.com/oas-tools/oas-tools/compare/v3.0.3...v3.1.0) (2023-03-07)


### Bug Fixes

* Avoid route overlapping when registering ([eaf73a0](https://github.com/oas-tools/oas-tools/commit/eaf73a03f5129ee3a818418f1b2bef5872e2458b))
* Compatibility issue with parameter parsing ([8bb0aa5](https://github.com/oas-tools/oas-tools/commit/8bb0aa523ce3919d0bb0118ee8cffb265a6a7e5a)), closes [#362](https://github.com/oas-tools/oas-tools/issues/362) [#357](https://github.com/oas-tools/oas-tools/issues/357)
* support jest test ([918de8c](https://github.com/oas-tools/oas-tools/commit/918de8ca0e75a21598a5e79b4e374f3badb558c6))
* when an option field is object type and is missing from request body, the request body shall considered as valid ([68e860b](https://github.com/oas-tools/oas-tools/commit/68e860b36cb2ab41601bc2c82015c3ce8d289687)), closes [#356](https://github.com/oas-tools/oas-tools/issues/356)


### Features

* added async error handling for router and associated tests ([6c4a53f](https://github.com/oas-tools/oas-tools/commit/6c4a53f614f1d462e484c84255ba6600962645c1))
* upgrade js-yaml to v4.1.0 ([906596a](https://github.com/oas-tools/oas-tools/commit/906596aa04fc9c93f2a17872787066ff8fee0df4))



## [3.0.3](https://github.com/oas-tools/oas-tools/compare/v3.0.2...v3.0.3) (2022-11-21)


### Bug Fixes

* Backward compatibility function error ([a401ca6](https://github.com/oas-tools/oas-tools/commit/a401ca6e605795a2f9d2f6658fe55df68ac4ac27))



## [3.0.2](https://github.com/oas-tools/oas-tools/compare/v3.0.1...v3.0.2) (2022-09-26)


### Bug Fixes

* Allow null values ([22e72d2](https://github.com/oas-tools/oas-tools/commit/22e72d291d432650f2a4e473404179981ce89675))
* Check for extraneous query parameters ([5f0c59b](https://github.com/oas-tools/oas-tools/commit/5f0c59b6be4db3dff4c24dfe1663628d0fb5c0d1))
* Data not being sent after response validation ([b85a6c4](https://github.com/oas-tools/oas-tools/commit/b85a6c46f927a0b107b9748bdc617aa3fc62f27c))
* default and nullable fields logic ([2670211](https://github.com/oas-tools/oas-tools/commit/267021136dc6fddd0f2c09c66a933ad51c81b689))
* Support for OAS 'default' keyword in schemas ([94c4297](https://github.com/oas-tools/oas-tools/commit/94c429708af18976e5cd3bc8a77f1560130a8693))
* Support for readOnly and writeOnly ([be25966](https://github.com/oas-tools/oas-tools/commit/be25966e7c2a572da8f7e1dcf5193370ee766e17))



## [3.0.1](https://github.com/oas-tools/oas-tools/compare/v3.0.0...v3.0.1) (2022-09-12)


### Bug Fixes

* Fixed routing when controller is async ([ee1650b](https://github.com/oas-tools/oas-tools/commit/ee1650b6859b87b703f707b98d01755ef7f8b9a9))
* support for common path parameters ([b299b62](https://github.com/oas-tools/oas-tools/commit/b299b6235d46bf066010cf40f89ffcd08476ce87))



# [3.0.0](https://github.com/oas-tools/oas-tools/compare/4a98e980ae1f458ab9fbac05b3e9581a6478a965...v3.0.0) (2022-08-14)


### Bug Fixes

* .snyk & package.json to reduce vulnerabilities ([4a98e98](https://github.com/oas-tools/oas-tools/commit/4a98e980ae1f458ab9fbac05b3e9581a6478a965))
* .snyk, package.json & package-lock.json to reduce vulnerabilities ([9c0664d](https://github.com/oas-tools/oas-tools/commit/9c0664d97a447ae22a398e5711089ccdf41d55f7))
* .snyk, package.json & package-lock.json to reduce vulnerabilities ([d4964b4](https://github.com/oas-tools/oas-tools/commit/d4964b452e0c767ca0f00656948c54b59f2deef1))
* Avoid conflict of multiple http secSchemes ([51df899](https://github.com/oas-tools/oas-tools/commit/51df89918c3ccc2cab94efc7d162d2fd7a133c1f))
* Avoid returning promise when calling 2.X init ([f846061](https://github.com/oas-tools/oas-tools/commit/f8460617519a59363b848b4f515b99020b8a27c4))
* Backwards compatibility initialization ([3ee3973](https://github.com/oas-tools/oas-tools/commit/3ee397398452815c7b195de3e5a8835e295ace52))
* Changed replaceAll with replace for Node v14 ([f340f4a](https://github.com/oas-tools/oas-tools/commit/f340f4a6c4d8eb037dcb4de8a475d917f87c47b6))
* Check if secSchemes are defined in OASecurity ([b59b23a](https://github.com/oas-tools/oas-tools/commit/b59b23a71b4f1d0b19a70c69842166ab475fdcb5))
* Fixed error when not defining requestBody ([a70353d](https://github.com/oas-tools/oas-tools/commit/a70353dd6796fb676d397000d9f7d0105f42ca66))
* Fixed error when using default config ([f1804ac](https://github.com/oas-tools/oas-tools/commit/f1804ac8211f91d1315d3e7ad8bd5e6812a74480))
* Fixed exception when no param sent on cookie ([58f69d8](https://github.com/oas-tools/oas-tools/commit/58f69d88004aeca3bdbb378d6e38b2aa5a09b9b6))
* Fixed logger not setting level correctly ([5db1b6b](https://github.com/oas-tools/oas-tools/commit/5db1b6b135e6a5597811be2fbab64a20ace92da6))
* Fixed params and security minor bugs ([275c34b](https://github.com/oas-tools/oas-tools/commit/275c34b05c8d2f95bd66d9f6f68e8445cf838666))
* Fixed version ([96d7e21](https://github.com/oas-tools/oas-tools/commit/96d7e21382fe174ed7da7540268dc98b153d17eb))
* fixNullable mutates oasDoc in oas-router ([433bd65](https://github.com/oas-tools/oas-tools/commit/433bd65b41b687de5a53f218b86486406f3269ac))
* Load controllers with annotations disabled ([00711f6](https://github.com/oas-tools/oas-tools/commit/00711f6783c42da1576881c970fc7d9ff7a4a949))
* Log function name when wrapped in OASBase ([362b64d](https://github.com/oas-tools/oas-tools/commit/362b64d6ac3bc3eb9da9ac5e1514f443f1899083))
* Modified imports to avoid experimental flag ([c5d81d2](https://github.com/oas-tools/oas-tools/commit/c5d81d2e2b4e20a6d7b6343182719f651a633ab1))
* Modified use( ) to accept imports directly ([6209297](https://github.com/oas-tools/oas-tools/commit/620929779a66581a9098cd83b447890885bc3e3b))
* Modules not found when installed in parent ([e6e0e40](https://github.com/oas-tools/oas-tools/commit/e6e0e40faa0993312731e9f006b36bc54d38fc7e))
* Moved multer to DevDependencies ([be64c9b](https://github.com/oas-tools/oas-tools/commit/be64c9b3c497e58a5aadcffe0b98a34e394f52d3))
* package.json & package-lock.json to reduce vulnerabilities ([0442c7f](https://github.com/oas-tools/oas-tools/commit/0442c7f77e17bd5bc359700c1e487d96f0ce042b))
* package.json & package-lock.json to reduce vulnerabilities ([e414530](https://github.com/oas-tools/oas-tools/commit/e41453029e56879985c243838a1abbcb9d625ae7))
* package.json & package-lock.json to reduce vulnerabilities ([5991873](https://github.com/oas-tools/oas-tools/commit/5991873cbf7451e7f8896c1a5ebf812814c804b0))
* package.json & package-lock.json to reduce vulnerabilities ([8f36427](https://github.com/oas-tools/oas-tools/commit/8f36427880ec005e4e8c38c9991f65b5f160862a))
* package.json & package-lock.json to reduce vulnerabilities ([4fb0321](https://github.com/oas-tools/oas-tools/commit/4fb032166dba80248dec15a08f217150cf901198))
* package.json & package-lock.json to reduce vulnerabilities ([a15e605](https://github.com/oas-tools/oas-tools/commit/a15e6054bc6ada404ee2d9a8ad69b867efa9d488))
* package.json & package-lock.json to reduce vulnerabilities ([6c166cf](https://github.com/oas-tools/oas-tools/commit/6c166cff208f2869e0e3c962cb022a1d618a792b))
* package.json & package-lock.json to reduce vulnerabilities ([6eeac11](https://github.com/oas-tools/oas-tools/commit/6eeac11f8367f4f8609de23b6f7f5a440b41ab49))
* package.json & package-lock.json to reduce vulnerabilities ([8f432d2](https://github.com/oas-tools/oas-tools/commit/8f432d20b7362c81eee92edafcf94f35ded54e4d))
* package.json & package-lock.json to reduce vulnerabilities ([059536f](https://github.com/oas-tools/oas-tools/commit/059536f1964dc7f4fcd1e0f10e7ab885fe50d291))
* package.json & package-lock.json to reduce vulnerabilities ([bf7310c](https://github.com/oas-tools/oas-tools/commit/bf7310ce35af99c71c41ac16c7d29f80326b580b))
* package.json & package-lock.json to reduce vulnerabilities ([418675c](https://github.com/oas-tools/oas-tools/commit/418675c01c83783a9338c865984f57ec8744acf2))
* package.json & package-lock.json to reduce vulnerabilities ([afb8688](https://github.com/oas-tools/oas-tools/commit/afb868812a810605d7737368951b7bcbdfb918a8))
* package.json to reduce vulnerabilities ([44fd721](https://github.com/oas-tools/oas-tools/commit/44fd721830379514326cb101c55bd390cc9f8880))
* package.json, package-lock.json & .snyk to reduce vulnerabilities ([d695aea](https://github.com/oas-tools/oas-tools/commit/d695aea6e17127ebe4116eab37e9df663d228369))
* package.json, package-lock.json & .snyk to reduce vulnerabilities ([54473e0](https://github.com/oas-tools/oas-tools/commit/54473e0f6526ebbe533d0a5111fe1645fbaad259))
* package.json, package-lock.json & .snyk to reduce vulnerabilities ([fbdc73f](https://github.com/oas-tools/oas-tools/commit/fbdc73f58eb1ca3710cd004f94ed272766935240))
* package.json, package-lock.json & .snyk to reduce vulnerabilities ([4c313d3](https://github.com/oas-tools/oas-tools/commit/4c313d3dd27f705b884aa38453c328123fad970f))
* package.json, package-lock.json & .snyk to reduce vulnerabilities ([fb1ac93](https://github.com/oas-tools/oas-tools/commit/fb1ac9339b3be595737416b931dea91f3f98042f))
* **package:** update json-schema-deref to version 0.5.0 ([9aebdf4](https://github.com/oas-tools/oas-tools/commit/9aebdf410ce58080656b7efcac194a63c6af0cc5))
* **package:** update json-schema-deref-sync to version 0.10.0 ([0dad266](https://github.com/oas-tools/oas-tools/commit/0dad2667db7324cf92637a8532b7bc55c232cda0))
* **package:** update json-schema-deref-sync to version 0.13.0 ([36d4758](https://github.com/oas-tools/oas-tools/commit/36d475872cd7157de1a8582fbef9cdbc0b5ef0d9))
* **package:** update json-schema-deref-sync to version 0.7.0 ([242036f](https://github.com/oas-tools/oas-tools/commit/242036fd4e1b75b791254298c4a45bef4658023c)), closes [#37](https://github.com/oas-tools/oas-tools/issues/37)
* **package:** update json-schema-deref-sync to version 0.9.0 ([49833cc](https://github.com/oas-tools/oas-tools/commit/49833cc1d9b26573e915dcd0da997ed56e3d28cd))
* **package:** update snyk to version 2.0.0 ([562d3fc](https://github.com/oas-tools/oas-tools/commit/562d3fcaa8513086b712931f1c959bc0065b40a8))
* **package:** update validator to version 11.0.0 ([2956971](https://github.com/oas-tools/oas-tools/commit/2956971dd81fc400d6e4781bcb1500a24415c33f))
* **package:** update validator to version 12.0.0 ([a34e2c4](https://github.com/oas-tools/oas-tools/commit/a34e2c456f881d32edc5ba18ec96f1b8e6079122))
* **package:** update validator to version 13.0.0 ([06c074c](https://github.com/oas-tools/oas-tools/commit/06c074c4d4a3f0eec89e58562fc6fa3280f5a5a6))
* **package:** update z-schema to version 4.2.0 ([7678151](https://github.com/oas-tools/oas-tools/commit/7678151fc0356c1b79deb052e01fa1570aeeeebb))
* query param failing if they are not string ([#1](https://github.com/oas-tools/oas-tools/issues/1)) ([8e91a27](https://github.com/oas-tools/oas-tools/commit/8e91a2784bf9e3d5ed045f5b59bb9d3d4736c7c8))
* Removed date parse form params middleware ([e317321](https://github.com/oas-tools/oas-tools/commit/e317321908d424c4c8fa272ac15cd85fc5c439b9))
* Removed unnecessary config ([6fec395](https://github.com/oas-tools/oas-tools/commit/6fec395c916f6e8fcb4e0a4feb3b012649bba353))
* Routing error with x-router-controller ([3e42e9e](https://github.com/oas-tools/oas-tools/commit/3e42e9eb9c38df97140798399d86c25123774f16))
* Validator not validating undefined params ([27fe2f3](https://github.com/oas-tools/oas-tools/commit/27fe2f36e79123578e698608e03f148e113dff16))


* feat!: Transformed package into ES Module ([bab7f3d](https://github.com/oas-tools/oas-tools/commit/bab7f3d41344e89f4b414e915f78d7af1e4347f8))
* refactor!: Removed customErrorHandling option ([13c1317](https://github.com/oas-tools/oas-tools/commit/13c13173a6e492be5ccfe7defec23117ae2d2a4e))
* feat!: Router middleware refactorization. ([56774ea](https://github.com/oas-tools/oas-tools/commit/56774ea9a5f621771d6e2e371e632a5a042746e9))
* feat!: removed x-swagger-router-controller ([d6c61b6](https://github.com/oas-tools/oas-tools/commit/d6c61b6c053969542e53284fad65c0bff7ee791e))
* chore!: Node 12.x support ([56d732e](https://github.com/oas-tools/oas-tools/commit/56d732e69c2c805533a13c46a552bc7e9b88f8cc))


### Features

* Ability to hide swagger methods through conf ([d302cbc](https://github.com/oas-tools/oas-tools/commit/d302cbc2b65caa775779415f792346cfa0ae0a60))
* Added explode & style parameter support ([c47a729](https://github.com/oas-tools/oas-tools/commit/c47a729b11df6372605880ee80622eef81a93e3a))
* Backwards compatibility ([1b285fd](https://github.com/oas-tools/oas-tools/commit/1b285fdb4cce796e33f3ec7136eb3625f7be6f62))
* Complete backwards compatibility ([dc57b06](https://github.com/oas-tools/oas-tools/commit/dc57b062c6120cbc97512f72ad74b625cdd3c6e3))
* Configuration through JS file ([91aba06](https://github.com/oas-tools/oas-tools/commit/91aba06269488d7156a4c1b8d7fa56505e60a387))
* Export utils module ([4ca4bf7](https://github.com/oas-tools/oas-tools/commit/4ca4bf7ff7170847400d2343adaa835de60d2025))
* Implemented annotations (experimental) ([0d7309e](https://github.com/oas-tools/oas-tools/commit/0d7309ef7e835a0630cde9c4bf008b8c2ae37e6b))
* Implemented apikey auth and multiple schemes ([f6db873](https://github.com/oas-tools/oas-tools/commit/f6db8738bdf3b9e50ff0a1cf87ee99c3cba0195b))
* Implemented custom errors ([655da71](https://github.com/oas-tools/oas-tools/commit/655da711681fd8af8c20b270522af28e1051f095))
* Implemented error handler middleware ([2b21370](https://github.com/oas-tools/oas-tools/commit/2b21370527f253d48d43ef91f05839ee5ec9e7ab))
* Implemented external middleware imports ([baf30ba](https://github.com/oas-tools/oas-tools/commit/baf30baadf51d2e8feebb2d2c44e894f9dd7c0f6))
* Implemented http auth & security ([82c458a](https://github.com/oas-tools/oas-tools/commit/82c458af8c58dab3b7130eb16a44c58ae9631cf3))
* Implemented new config options ([389a759](https://github.com/oas-tools/oas-tools/commit/389a75985b036b7d86ff2b8aa8e0e0cb5c918225))
* Implemented oasTools.use( ) function ([b5d95a8](https://github.com/oas-tools/oas-tools/commit/b5d95a8b39814f9c79cf8b44cefbd6c4bad2ae01))
* Implemented oauth and openIdConnect ([736c2a3](https://github.com/oas-tools/oas-tools/commit/736c2a34fbd9b2968413676e9661f5067df6953d))
* Implemented request validation using Ajv ([1515bb3](https://github.com/oas-tools/oas-tools/commit/1515bb3baf97502c9db19c16e8ca36daa09d082d))
* Implemented response validation middleware ([60f3594](https://github.com/oas-tools/oas-tools/commit/60f359484a8c07fe0d95664385436d0ef080ad4b))
* Implemented SwaggerUI native middleware ([c450196](https://github.com/oas-tools/oas-tools/commit/c4501964cdac2515846c6eab7f31f2abf8bfc6e3))
* Modified security handlers to return values ([fc16058](https://github.com/oas-tools/oas-tools/commit/fc16058db7589bcfd87aa738dec71397e70fce4e))
* **multipart-formdata:** add POST /multipartFormdata to openAPI yaml ([4678546](https://github.com/oas-tools/oas-tools/commit/467854621448e584090f2f68e7ded3b28995510b))
* **multipart-formdata:** add security check for POST ([4d74b54](https://github.com/oas-tools/oas-tools/commit/4d74b546a66b90e452c2712ba0aa1d6647eb3989))
* **multipart-formdata:** allow content types other than json ([26093d3](https://github.com/oas-tools/oas-tools/commit/26093d3c9e8556433be5c0200aa31908a75ccd2f))
* **multipart-formdata:** multer as express middleware ([74323ca](https://github.com/oas-tools/oas-tools/commit/74323ca0d13f26dfee42eea8779790d286a9ec16))
* **multipart-formdata:** pass file properties to openAPI spec validator ([40f5e43](https://github.com/oas-tools/oas-tools/commit/40f5e43ca7deb9d34e39645330c1b42bb0d6025e))
* **multipart-formdata:** validate content types other than appl./json ([42fac74](https://github.com/oas-tools/oas-tools/commit/42fac74968c8f299a7a050628cc45b635306e7c9))
* OAS 3.1 support ([37d7e20](https://github.com/oas-tools/oas-tools/commit/37d7e201e123019d65c5d8a76ebb7a268ec98c88))
* Router exception handling on initialization ([daf7e3f](https://github.com/oas-tools/oas-tools/commit/daf7e3f9cb84f55257efbfe66e63f0f297b40f7a))
* Support for OpenApi 3.1 ([1695d68](https://github.com/oas-tools/oas-tools/commit/1695d68c2f3db527165b06fae2ecae76afd3751b))
* Support parameters defined through content ([831795a](https://github.com/oas-tools/oas-tools/commit/831795a9df1058de52e3cba54243b69eda90c9b3))
* Updated Swagger UI to 4.5.2 ([df6f2e3](https://github.com/oas-tools/oas-tools/commit/df6f2e3c384a593023152c6f10a7acd4b635b5bf))


### Reverts

* Revert "Updated dependencies" ([6a6bdb5](https://github.com/oas-tools/oas-tools/commit/6a6bdb5e0d72998966c17d27b8f9c665bf8d67a6))


### BREAKING CHANGES

* Dropped support for CommonJS and Node <= 12.X
* Removed auth-middleware, can be integrated as a handler
* This will be implemented through middlware (native/ext)
* Removed x-swagger-router-controller.
* x-swagger-router-controller has been removed.
* drop Node 10 support



