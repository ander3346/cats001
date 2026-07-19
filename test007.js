/*二级菜单======================================================== */
document.addEventListener('DOMContentLoaded',()=>{
    /*二级菜单*/ 
    var menulists =document.getElementsByClassName('list');
    var listlevel2=document.getElementsByClassName('listlevel2')[0];
    var list1=document.getElementsByClassName('list1')[0];
    var list2=document.getElementsByClassName('list2')[0];
    var list3=document.getElementsByClassName('list3')[0];
    var list4=document.getElementsByClassName('list4')[0];
    var timer=null;
    function ListLevelclose(){
        //container
        listlevel2.style.display='none';
        //sonElements
        list1.style.display='none';
        list2.style.display='none';
        list3.style.display='none';
        list4.style.display='none';

        list1.style.opacity='0';
        list2.style.opacity='0';
        list3.style.opacity='0';
        list4.style.opacity='0';
    }
    function visiable(){
        list1.style.opacity='1';
        list2.style.opacity='1';
        list3.style.opacity='1';
        list4.style.opacity='1';
    };
    function ListLevel2(menulists,list){
        menulists.addEventListener('mouseenter',()=>{
            clearTimeout(timer);
            ListLevelclose();
            timer=setTimeout(()=>{
                listlevel2.style.display='flex';
                list.style.display='flex';
                
                list.style.transition='opacity 1s ease-in-out';
                visiable();
            },0)
            
            
        });
        menulists.addEventListener('mouseleave',()=>{
            timer=setTimeout(()=>{
                listlevel2.style.display='none';
                list.style.display='none';
            },300);
        });
        list.addEventListener('mouseenter',()=>{
            clearTimeout(timer);
            list.style.display='flex'
        });
        list.addEventListener('mouseleave',()=>{
            timer=setTimeout(()=>{
                ListLevelclose()
            });
        
        })
    }
    ListLevel2(menulists[0],list1);
    ListLevel2(menulists[1],list2);
    ListLevel2(menulists[2],list3);
    ListLevel2(menulists[3],list4);
})
/*搜索框======================================================== */
document.addEventListener('DOMContentLoaded',()=>{
    /*设置搜索框*/
    var input01=document.getElementsByClassName('input01')[0];
    var tip=document.getElementById('tiptext');
    input01.onfocus=function(){
        tip.classList.remove('animation_Back');
        tip.classList.add('animation_LeftMove');
    }
    input01.onblur=function(){
        tip.classList.remove('animation_LeftMove');
        tip.classList.add('animation_Back');
        input01.value='';
    }
})
/*侧滚动条======================================================== */
document.addEventListener('DOMContentLoaded',()=>{
/*滚动条+显示*/
    var scorllbar=document.getElementById('scorllbar0');
    //菜单
    var story1=document.getElementById('storybar1');
    var story2=document.getElementById('storybar2');
    var story3=document.getElementById('storybar3');
    var story4=document.getElementById('storybar4');
    var story5=document.getElementById('storybar5');
    //页面
    var main1_1=document.getElementById('main1_1');
    var main1_2=document.getElementById('main1_2');
    var main1_3=document.getElementById('main1_3');
    var main1_4=document.getElementById('main1_4');
    var main1_5=document.getElementById('main1_5');
    //关闭全部
    function closeAll(){
        main1_1.style.display='none';
        main1_2.style.display='none';
        main1_3.style.display='none';
        main1_4.style.display='none';
        main1_5.style.display='none';
        // story1.style.backgroundColor='transparent';
        // story2.style.backgroundColor='transparent';
        // story3.style.backgroundColor='transparent';
        // story4.style.backgroundColor='transparent';
        // story5.style.backgroundColor='transparent';
    }
    //点击切换
    function clickvisiable(story,main1_x){
        story.addEventListener('click',()=>{
            closeAll();
            main1_x.style.display='block';
        })
    }
    closeAll();
    clickvisiable(story1,main1_1);
    clickvisiable(story2,main1_2);
    clickvisiable(story3,main1_3);
    clickvisiable(story4,main1_4);
    clickvisiable(story5,main1_5);

    // story1.style.backgroundColor='aqua';
    main1_1.style.display='block';
    //hover出发滚动条下滑
    story1.addEventListener('mouseenter',()=>{
        scorllbar.style.marginTop='30px';
        scorllbar.style.transition='0.4s';
        // story1.style.backgroundColor='aqua'
    })
    story2.addEventListener('mouseenter',()=>{
        scorllbar.style.marginTop='110px';
        scorllbar.style.transition='0.4s';
        // story2.style.backgroundColor='aqua'
    })
    story3.addEventListener('mouseenter',()=>{
        scorllbar.style.marginTop='180px';
        scorllbar.style.transition='0.4s';
        // story3.style.backgroundColor='aqua'
    })
    story4.addEventListener('mouseenter',()=>{
        scorllbar.style.marginTop='260px';
        scorllbar.style.transition='0.4s';
        // story4.style.backgroundColor='aqua'
    })
    story5.addEventListener('mouseenter',()=>{
        scorllbar.style.marginTop='340px';
        scorllbar.style.transition='0.4s';
        // story5.style.backgroundColor='aqua'
    })

})
/*轮播图======================================================== */
document.addEventListener('DOMContentLoaded',()=>{
var widget=document.getElementsByClassName('widget')[0];
    var sliders=document.getElementsByClassName('side_Carousel');
    var sliderpics=document.getElementsByClassName('sliderpic');
    var TheWorld=document.getElementById('TheWorld');
    var counter=-1;
    /*轮播图vision1顺序乱目不暇接=====================
            function move(i){
                sliders[i].style.marginLeft='10px';
                sliders[i].style.transition='5s';
            }
            function addlistener(i){
                sliders[i].addEventListener('transitionend',()=>{
                    sliders[i].style.marginLeft='1560px';
                    setTimeout(()=>{
                        move(i);
                    },4000)
                })
            }
            for(var i=0;i<sliders.length;i++){
                addlistener(i);
            }
            sliders[0].style.marginLeft='11px';
            sliders[0].style.transition='0.2s';
            sliders[1].style.marginLeft='11px';
            sliders[1].style.transition='0.9s';
            sliders[2].style.marginLeft='11px';
            sliders[2].style.transition='1.8s';
            sliders[3].style.marginLeft='11px';
            sliders[3].style.transition='2.9s';
            sliders[4].style.marginLeft='11px';
            sliders[4].style.transition='5.5s';
            sliders[5].style.marginLeft='11px';
            sliders[5].style.transition='6.8s';
    */
    /*轮播图vision2卡顿可单独设置=============================
    var timer=[];
    function move(i){
            if(timer[i])clearTimeout(timer[i]);
            var currentmargin=parseInt(getComputedStyle(sliders[i]).marginLeft);
            const gap=310;
            var newmargin=0;
            //判断位置
            if(currentmargin>20){
                newmargin=currentmargin-gap;
                //移动+fade
                sliders[i].style.opacity='1';    
                sliders[i].style.marginLeft=newmargin+'px';
                sliders[i].style.transition='2s linear';
            }
            //如果在第0个就回最后一个
            else{
                sliders[i].style.marginLeft='2180px';
                sliders[i].style.transition='0s';
                sliders[i].style.opacity='0.5';
            }
            //循环
            timer[i]=setTimeout(()=>{
                move(i);
            },2000)    
        }
        for(let i=0;i<sliders.length;i++){           
            move(i);
        }
    */
    /*轮播图vision3流畅单一======================== */
    //初始化(到始端)
    setInterval(() => {
                if(sliders[0].style.marginLeft=='2180px'){
                     counter++;
                }
            }, 1000); 
    function initialise(i){        
        sliders[i].style.marginLeft='10px';
        sliders[i].style.transition=`${(2*i)}s linear`;
        sliders[i].addEventListener('transitionend',()=>{
            sliders[i].style.marginLeft='2180px';
            sliders[i].style.transition='0s';
            
            
        })
        if(i==0){//0存在bug
            sliders[i].style.marginLeft='2180px';
            sliders[i].style.transition='0s';
            sliders[i].addEventListener('transitionend',()=>{
                sliders[i].style.marginLeft='2180px';
                sliders[i].style.transition='0s';
            })
        }       
    }
    //couter
    setInterval(() => {
                console.log('counter=',counter);
            }, 1000);
    
    //执行滑动
    function move(i){
        sliders[i].style.marginLeft='10px';
        sliders[i].style.transition='14s linear';     
    }
        for(let i=0;i<sliders.length;i++){           
            //初始化后(初始动画结束)开始
            sliders[i].addEventListener('transitionend',()=>{
                const now=new Date();
                sliderpics[i].src='img/manga'+parseInt((i*now.getSeconds()+123546)%72+1)+'.jpg';                
                //此处设置定时器为了不被上两句干扰 2s在始端停 
                timer=setTimeout(()=>{move(i);},2000);
             })
            initialise(i);
            //0有bug单独设置
            timer=setTimeout(()=>{
                move(0);
                sliderpics[0].src='img/manga32.jpg';   
            },2000); 
        }
    
    
    //打算加暂停
    TheWorld.onclick=()=>{
        for(let i=0;i<sliders.length;i++){
            sliders[i].classList.toggle('paused');
        }
    }
})
/*全部加载完后再显示页面 这个解决刷新闪烁出不需要出现的内容================*/
document.addEventListener('DOMContentLoaded',function(){
    document.body.style.opacity='1';
})

