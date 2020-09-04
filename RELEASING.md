# Releasing

Releasing the application to work with auto update is very simple.

1. Increment the application version in `package.json`.
2. Push changes to master to trigger github actions to build the binaries.
   - Ensure that `.yml` files aren't being left out in the artifacts. These are needed for auto-update to work correctly.
3. Create a github release with the **tag** being in the format `v[Version]`.
   - E.g if the version was `2.1.1` then the github tag would be `v2.1.1`
4. Add release notes
5. Publish the release!
