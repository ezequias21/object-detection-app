var genereateBtn = document.querySelector('#generateRoomCode')

const generateUUID = () => {
    document.querySelector('[for=createRoomCode]').classList.add('active')
    document.querySelector('#createRoomCode').value = crypto.randomUUID()
}


if(genereateBtn) {
    genereateBtn.addEventListener('click', generateUUID)
}

const urlParams = new URLSearchParams(window.location.search);
const roomCodeStatus = urlParams.get('roomCodeStatus');
if(roomCodeStatus) {
    switch(roomCodeStatus) {
        case "not found":
            console.log(roomCodeStatus)
            M.toast({html: 'A sala que você quer acessar não existe!'})
        break

        case 'expired':
            M.toast({html: 'A sala que você quer acessar foi expirada!'})
        break
    }
}