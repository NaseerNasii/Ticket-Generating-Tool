let page1=document.querySelector(".mod1");
let page2=document.querySelector(".mod2");
let openBtn=document.querySelector(".open");
let gobackBtn=document.querySelector(".go-back");
let addBtn=document.querySelector(".add-btn");
let saveBtn=document.querySelector(".submit-btn");
let addBtnflag=true;
let showmodel=document.querySelector(".model-cont");
let allprioritycolours=document.querySelectorAll(".priority-colours");
let text=document.querySelector(".textarea-cont");
let tic_color="lightpink";
let uid = new ShortUniqueId();
let alltickets=document.querySelector(".main-cont");
let deleteBtn=document.querySelector(".remove-btn");
let deleteBtnflag=true;
let colorArr=['lightpink','orange','green','brown'];
let toolboxcolour=document.querySelectorAll(".colour");
let allcolorBtn=document.querySelector(".all");
let ticketcount=document.querySelector(".ticcount");
let infoBtn=document.querySelector(".total-btn");
let infoBtnflag=true;
let ticketArray=[];//to push local storage we are creating this




//if i click open button it should go to the next page which is page2
openBtn.addEventListener('click',()=>{
    page1.style.display='none';
    page2.style.display='inline';
})


//if i click go back icon it will go to again  page1
gobackBtn.addEventListener('click',()=>{
    page1.style.display='inline';
    page2.style.display='none';
})


// if add button is clicked just show the textarea again if it is clicked remove the text area

addBtn.addEventListener('click',(e)=>{
    if(addBtnflag){
       showmodel.style.display="flex";
    }else{
        showmodel.style.display="none";
    }
    addBtnflag=!addBtnflag;
})

//if I click any ticket from model container the ticket should get border
  //which means am gonna add active class to that div

allprioritycolours.forEach((color)=>{
    color.addEventListener('click',(e)=>{
        //remove all 'active' class from all priority colour
         allprioritycolours.forEach((colors)=>{
            colors.classList.remove('active');
         })
        // add active to particular colour
        color.classList.add('active');
        //if we click particular color we r fetching what is that color
        tic_color=color.classList[0];
        
    })
})

// when we click "click here to save tickets" button we need to store tickets dynamically

saveBtn.addEventListener('click',(e)=>{
    //store the tickets so calling storeticket function
    storeticket(tic_color,`#${uid.rnd()}`,text.value,true);
    //after storing the ticket 
    //1)showing model container should disappear
    showmodel.style.display='none';//this line is not only enough we need to toggle addBtnflag otherwise we need to click addsymbol twise 
    addBtnflag=!addBtnflag; 
    //2) when we click addBtn there is no previous text
    text.value="";
})

let storeticket=(color,id,desc,addornot)=>{
    
    let createTicket=document.createElement('div');
    createTicket.classList.add('ticket-cont');
    createTicket.innerHTML= `<div class="ticket-colour ${color}"></div>
                       <div class="ticket-id">${id}</div>
                       <div class="task-area">${desc}</div>
                       <div class="ticket-lock"><i class="fa-solid fa-lock lock"></i></div>`
    alltickets.appendChild(createTicket);   
    let ticketMetaData={
        color:color,
        id:id,
        desc:desc
    }
    if(addornot){
       ticketArray.push(ticketMetaData);
       localStorage.setItem("Ticket",JSON.stringify(ticketArray));//we are adding our ticketarray into
       //local storage
    }   
    console.log(ticketArray);
    handledelete(createTicket);
    handleLockUnlock(createTicket);
    handleHeadColor(createTicket);
    
   

}

//if I click delete icon it should indicate delete mode is activated
//delete icon shoul be in red color
deleteBtn.addEventListener('click',(e)=>{
    if(deleteBtnflag){
        alert("DELETE MODE IS ACTIVATED , JUST CLICK ON THE TICKET , IT WILL VANISH");
        deleteBtn.style.color='red';
        alltickets.classList.add('shake-all-ticket');
        
    }else{
        deleteBtn.style.color='';
        tickets=false;
        alltickets.classList.remove('shake-all-ticket');
    }
    deleteBtnflag=!deleteBtnflag;

})

// it will give the surity we can delete tickets bcz 100% ticket is created. that's why we are calling this function after storeticket
let handledelete=(ticket)=>{
   ticket.addEventListener('click',(e)=>{
      if(!deleteBtnflag) {
        ticket.remove();
        let tic_id=ticket.querySelector(".ticket-id").innerText;
        let tic_idx=ticketArray.findIndex((t)=>{
            return t.id==tic_id;
        })
        ticketArray.splice(tic_idx,1);//removing ticket from array
        console.log(ticketArray);
        localStorage.setItem("Ticket",JSON.stringify(ticketArray)) //updating local storage
      }
   })
}

// when I click lock symbom it should change unlock symbol also allow to edit desc and changing priority color
let handleLockUnlock=(ticket)=>{
    let lock=ticket.querySelector('.lock');
    let taskarea=ticket.querySelector(".task-area");
    let tic_id=ticket.querySelector(".ticket-id").innerText;
    lock.addEventListener('click',(e)=>{
        if(lock.classList.contains('fa-lock')){
            //alert("You can change Description and priority color");
            lock.classList.remove('fa-lock');
            lock.classList.add('fa-lock-open');
            taskarea.setAttribute('contenteditable','true');
            
        }else{
            localStorage.setItem("Ticket",JSON.stringify(ticketArray));
            lock.classList.remove('fa-lock-open')
            lock.classList.add('fa-lock')
            taskarea.setAttribute('contenteditable','false');
            ticketArray.forEach((t)=>{
                if(t.id==tic_id){
                    t.desc=taskarea.innerText;
                    localStorage.setItem("Ticket",JSON.stringify(ticketArray)) //updating local storage
                }
            })
             
        }
    })

             
}

let handleHeadColor=(ticket)=>{
    let lock=ticket.querySelector('.lock')
    let tic_head=ticket.querySelector('.ticket-colour');
    let tic_id=ticket.querySelector(".ticket-id").innerText;
    tic_head.addEventListener('click',(e)=>{
         if(lock.classList.contains('fa-lock-open')){
            let tic_color=tic_head.classList[1];
            let cur_color_index=colorArr.findIndex((color)=>{
                return color==tic_color;
            })
            tic_head.classList.remove(tic_color);
            cur_color_index++;
            let new_color=colorArr[cur_color_index%4];
            tic_head.classList.add(new_color);
            ticketArray.forEach((t)=>{
                if(t.id==tic_id){
                    t.color=new_color;
                    localStorage.setItem("Ticket",JSON.stringify(ticketArray));
                }
            })
         }
    })
}


//filter out the tickets

toolboxcolour.forEach((color)=>{
    
    color.addEventListener('click',(e)=>{
        let cnt=0;
        let clickedcolor=color.classList[1];
        let tickets=document.querySelectorAll(".ticket-colour");
        tickets.forEach((ticket)=>{
            if(ticket.classList.contains(clickedcolor)){
                cnt++;
                ticket.parentElement.style.display='inline';
            }else{
                ticket.parentElement.style.display='none'
            }

        })
        if(infoBtn.classList.contains('info'))
           ticketcount.innerText=`TICKET COUNT IS - ${cnt}`;
        else 
           ticketcount.innerText=``      
    })
    
})

allcolorBtn.addEventListener('click',(e)=>{
    let cnt=0;
        let tickets=document.querySelectorAll(".ticket-colour");
        tickets.forEach((ticket)=>{
                ticket.parentElement.style.display='inline';
                cnt++;
        })
        if(infoBtn.classList.contains('info'))
          ticketcount.innerText=`ALL TICKET COUNT IS - ${cnt}`;
        else
        ticketcount.innerText=``
})


//
infoBtn.addEventListener('click',(e)=>{
    if(infoBtnflag){
      infoBtn.classList.add("info");
      alert("Info Mode is Started.just press on the tickets, You can see count of Tickets");
    }else{
        infoBtn.classList.remove("info"); 
        ticketcount.innerText=`` 
    }
    infoBtnflag=!infoBtnflag;
})
let ticketArrayStr=localStorage.getItem("Ticket");

if(ticketArrayStr){//if anything stored in our local storage we are getting back those data and creating
    ticketArray=JSON.parse(ticketArrayStr);//parse will change back to orgin format
    ticketArray.forEach((tic)=>{
        storeticket(tic.color,tic.id,tic.desc,false);
    })
}