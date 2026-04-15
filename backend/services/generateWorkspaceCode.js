
export const generateWorkspaceCode = () => {
  let characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";

  for(let i=0; i<6; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return code;
};

export const ensureUniqueCode = async (getWorkspaceByCode) => {
  let code = generateWorkspaceCode();
  let isUnique = false;

  while(!isUnique) {
    try {
       const existing = await getWorkspaceByCode(code);
       if(!existing) {
        isUnique = true;
       } else {
        code = generateWorkspaceCode();
       }
    } catch (err) {
      isUnique = true;
    }
  }

  return code;
};