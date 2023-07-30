(function(){
    let senderId;
    const socket = io();
    function generateId(){
        let code = Math.trunc(Math.random() * 999);
        let code2 = Math.trunc(Math.random()*999);
        let code3 = Math.trunc(Math.random()*999);
        return code + "-" + code2 + "-" + code3;
    }
    document.querySelector("#reciever-start-con-btn").addEventListener("click", function(){
        senderId = document.querySelector("#join-id").value;
        if(senderId.length == 0){
            return;
        }
        let joinId = generateId();
        socket.emit("sender-join",{
            uid:joinId,
            sender_uid:senderId
        });
        document.querySelector(".join-screen").classList.remove("active");
        document.querySelector(".fs-screen").classList.add("active");
    });
    let fileshare ={};
    
    socket.on("fs-meta", function(metadata){
        fileshare.metadata = metadata;
        fileshare.transmitted = 0;
        fileshare.buffer = [];

        let el = document.createElement("div");
        el.classList.add("item");
        el.innerHTML = `
        <div class="progress> 0% </div>
        <div class="filename >${metadata.filename}<div/>`;
        document.querySelector(".files.list").appendChild(e1);
        fileshare.progress_node = el.querySelector(".progress");
        socket.emit("fs-start", {
            uid:senderId
        });

    });
    socket.on("fs-share", function(buffer){
        fileshare.buffer.push(buffer);
        fileshare.transmitted += buffer.byteLength;
        fileshare.progress_node.innerHTML = Math.trunc(fileshare.transmitted / fileshare.metadata.total_buffer_size *100) + "%";
        if(fileshare.transmitted == fileshare.metadata.total_buffer_size){
            download(new Blob(fileshare.buffer), fileshare.metadata.filename);
            fileshare = {};
        }
        else{
            socket.emit("fs-start",{
                uid:senderId
            });
        }
    });
    
})();