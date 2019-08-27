# Contributing to oas-tools

We would like to thank you for your interest in contributing to this project. We are open to issues and pull requests, and we really appreciate any help from the community. However, for better management of your contributions, we encourage you to follow some guidelines. We will not ignore nor delete a contribution which does not follow these guidelines, but we could take longer to review and accept it.

## Issues

We will consider two diferent types of issues: **bugs** and **suggestions** (including enhancements, questions, optimizations...). Nevertheless, there are some common considerations to take into account:
* Please do not create an issue referencing multiple problems. Instead, **create as many issues as bugs you have found or suggestions you want to send**.
* **Check other open and closed issues** to see if your problem has been reported before.
* You can **check our project board**, named 'Planning', to see if an issue is planned for the next version, if it is being worked on, if it is solved, or if the patch has been released. Note that we will only close a community issue when its corresponding solution has been released.
* It may be useful to **include the type of issue in the title** so that we can easily classify it.
* You may **close an issue if you think that it is no longer relevant**. We appreciate any comment explaining why it was closed so that we know what happened.
* After submitting an issue, **we will review it and add a label** with its corresponding type.
* When we think that we can solve the issue in a near future release, **we will add a label with the expected version** that will include the corresponding patch.
* Note that due to several factors, **an issue may be delayed for a future version**. In the same way, **an issue could be solved and released faster**.

### Bugs

These issues refer to something that is not working properly. We recommend following these steps:
* **Write a descriptive title**, explaining what feature is not working.
* In the description, **explain the steps required to reproduce the bug**.
* **Include the expected and the actual result** to better understand the problem.
* It may be useful to **include log fragments**. Remember that you can change the log level to retrieve more information.
* It may be useful to **include the OpenAPI Specification file** that you are using or a fragment of it, so that we can use it to reproduce the bug.
* If the bug is related to the migration from swagger-tools to oas-tools, please **add both the original Swagger v2.0 spec file and the OAS v3.0 file** or their relevant fragments.
* You can **add the affected code fragment** if you think that you have found the cause of the bug.

### Suggestions
These issues refer to enhancements and new features, questions about oas-tools or even performance optimizations. These are the recommended steps for this kind of issue:
* **Write a descriptive title**, explaining what your suggestion is.
* In the description, **include a detailed explanation of the suggestion**.
* You can **add fragments of code or pseudocode** to better describe what you are suggesting.

## Pull requests

If you fix a bug or implement a suggestion, we greatly appreciate any pull request. These are the considerations to take into account when creating a pull request:
* We like to work in the `devel` branch and make a pull request to `master` when a new version is going to be released. Therefore, we recommend **creating the pull request in the `devel` branch**.
* If there is no related issue, please **create a new issue and add a reference to it** in the pull request.
* Do not create a single pull request for multiple issues. Instead, **create as many pull requests as issues you have solved**.
* It may be useful to **include a brief description of the issue**. The detailed explanation should be in the issue itself.
* **It is not necessary to add any reviewer**. We will make sure to check for new pull requests periodically.
* If you create a pull request, **follow these indications if any check is failing**:
  * If the **Travis CI** build fails, please check the report on its website. Note that the build might fail because either **the tests are failing**, **there are linting errors**, or **the build fails to start**. In any case, **try to fix the problem and check if the build passes**. We can assist you if you need any help.
  * If **Codecov** (code coverage) fails, you might have added or modified some functionality without enough testing. **If the coverage drop is about 1% or greater, please add new tests**. We can also create new tests if you need help.
  * If **Snyk** fails, **we will check the problem** because it is probably on our side. We will add a comment in the pull request if we need further action from you.
* If all checks are passing, **we will merge the pull request and its content will be available in the next version**.
