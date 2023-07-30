(function(){
    let recieverId;
    const socket = io();
    function generateId(){
        let code = Math.trunc(Math.random() * 999);
        let code2 = Math.trunc(Math.random()*999);
        let code3 = Math.trunc(Math.random()*999);
        return code + "-" + code2 + "-" + code3;
    }
    document.querySelector("#sender-start-con-btn").addEventListener("click", function(){
        let joinId = generateId();
        document.querySelector("#join-id").innerHTML =`
        <b> room ID </b>
        <span>${joinId}</span>`;
        socket.emit("sender-join",{
            uid:joinId
        });
    });
    socket.on("init", function(uid){
        recieverId = uid;
        document.querySelector(".join-screen").classList.remove("active");
        document.querySelector(".fs-screen").classList.add("active");
    });
    document.querySelector("#file-input").addEventListener("change", function(e){
        let file = e.target.files[0];
        if(!file){
            return;
        }
        let reader = new FileReader();
        reader.onload = function(e){
        let buffer = new UnitArray(reader.result);
        let el = document.createElement("div");
        let fName = file.name;
        el.classList.add("item");
        el.innerHTML = `
        <div class="progress> 0% </div>
        <div class="filename > `;{file.name}`<div/>`;
        console.log(fName);
        document.querySelector(".files.list").appendChild(e1);
        sharefile({
            filename:file.name,
            total_buffer_size:buffer.length,
            buffer_size:1024
        }, buffer, el.querySelector(".progress"));
    }
    reader.readAsArrayBuffer(file);
    });
    function shareFile(metadata, buffer, progress_node){
        socket.emit("file-meta",{
            uid:recieverId,
            metadata:metadata
        });
        socket.on("fs-share", function(){
            let chunk = buffer.slice(0,metadata.buffer_size);
            buffer = buffer.slice(metadata.buffer_size,buffer_length);
            progress_node.innerHTML = math.trunc((metadata.total_buffer_size - buffer.length)/ metadata.total_buffer_size *100) + "%";
            if(chunk.length != 0){
                socket.emit("file-raw", {
                    uid:recieverId,
                    buffer:chunk
                });
            }
        })
    }
    
})();