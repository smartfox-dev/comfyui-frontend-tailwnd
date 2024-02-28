export default async function convertFile2Base64(file) {
  let fileData = {}
  fileData.content2FileType = file.type
  fileData.content2Extension = file.name.split('.').pop()
  fileData.name = file.name
  await (new Promise(resolve => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = function () {
      fileData.data = reader.result
      resolve()
    }
  }))
  return fileData;
}