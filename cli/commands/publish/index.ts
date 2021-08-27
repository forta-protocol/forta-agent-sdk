import { assertExists } from '../../utils'
import { GetCredentials } from './get.credentials'
import { UploadImage } from './upload.image'
import { UploadManifest } from './upload.manifest'
import { PushToRegistry } from './push.to.registry'
import { CommandHandler } from '../..'

export default function providePublish(
  getCredentials: GetCredentials,
  uploadImage: UploadImage,
  uploadManifest: UploadManifest,
  pushToRegistry: PushToRegistry
): CommandHandler {
  assertExists(getCredentials, 'getCredentials')
  assertExists(uploadImage, 'uploadImage')
  assertExists(uploadManifest, 'uploadManifest')
  assertExists(pushToRegistry, 'pushToRegistry')

  return async function publish(cliArgs: any) {
    const { publicKey, privateKey } = await getCredentials()
    const imageReference = await uploadImage()
    const manifestReference = await uploadManifest(imageReference, publicKey, privateKey)
    await pushToRegistry(manifestReference, publicKey, privateKey)
    // invoke process.exit() otherwise a web3 websocket connection can prevent the process from completing
    process.exit()
  } 
}