const apiURL = process.env.NEXT_PUBLIC_API_URL;
const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

type CreateUserType = {
  name: string;
  sex: number;
};
export async function CreateUser(request: CreateUserType) {
  const name = request.name;
  const sex = Number(request.sex);
  const del_flg = 0;
  const wanderer_flg = 0;

  try {
    const raw = JSON.stringify({
      name: name,
      sex: sex,
      del_flg: del_flg,
      wanderer_flg: wanderer_flg,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow" as RequestRedirect,
    };

    const result = await fetch(apiURL + "/users", requestOptions)
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

type OnseiDataType = {
  id: number;
  user_id: number;
  audio_path: string;
};
export async function CreateOnseiData(request: OnseiDataType) {
  let id = request.id;
  let user_id = request.user_id;
  let audio_path = request.audio_path;
  let create_at = new Date().toISOString();
  let del_flg = 0;

  try {
    const raw = JSON.stringify({
      id: id,
      user_id: user_id,
      audio_path: audio_path,
      create_at: create_at,
      del_flg: del_flg,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow" as RequestRedirect,
    };

    await fetch(apiURL + "/onsei_lists", requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
  } catch (e) {}
}

export async function GetUser() {
  try {
    const requestOptions = {
      method: "GET",
      redirect: "follow" as RequestRedirect,
    };

    const result = await fetch(apiURL + "/users", requestOptions)
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

export async function PatchUser(id: number, wanderer_flg: number) {
  try {
    const raw = JSON.stringify({
      wanderer_flg: wanderer_flg,
    });

    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow" as RequestRedirect,
    };

    const result = await fetch(apiURL + "/users/" + id, requestOptions)
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
