const apiURL = process.env.NEXT_PUBLIC_API_URL;
const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

export async function AddAudio(id: number, fileUrl: string) {
  try {
    // Blob URLからBlobを取得
    const response = await fetch(fileUrl);
    const audioBlob = await response.blob();

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "audio/wav",
      },
      body: audioBlob,
      redirect: "follow" as RequestRedirect,
    };

    console.log(apiURL + "/audio/add/" + id);

    const result = await fetch(apiURL + "/audio/add/" + id, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        return JSON.parse(result);
      })
      .catch((error) => console.error(error));
    return result;
  } catch (e) {
    console.log(e);
    return e;
  }
}
