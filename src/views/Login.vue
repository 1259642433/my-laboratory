<template>
    <div class="login">
        <div class="bg"></div>
        <vue-particles
            color="#fff"
            :particleOpacity="0.7"
            :particlesNumber="60"
            shapeType="star"
            :particleSize="4"
            linesColor="#fff"
            :linesWidth="1"
            :lineLinked="true"
            :lineOpacity="0.4"
            :linesDistance="150"
            :moveSpeed="2"
            :hoverEffect="true"
            hoverMode="grab"
            :clickEffect="true"
            clickMode="push"
            class="particles"
        >
        </vue-particles>
        <div class="main">
            <div class="main-bg"></div>
            <div class="title">
                <div class="title-pre"></div>
                <span>登录</span>
            </div>
            <div class="inputs">
                <div class="inputs-item">
                    <span>账号:</span>
                    <input type="text" />
                </div>
                <div class="inputs-item">
                    <span>密码:</span>
                    <input type="password" />
                </div>
            </div>
            <button @click="$toPage('/live')">Login</button>
        </div>
    </div>
</template>

<script>
export default {
  name: 'login',
  data () {
    return {

    }
  }
}
</script>

<style lang="scss" scoped>
    .login {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: center;
        .bg {
            position: absolute;
            z-index: 0;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: url('../assets/img/login/bg.jpg');
            background-size: cover;
            background-repeat: no-repeat;
            background-position: center center;
        }
        .particles{
            position: absolute;
            z-index: 0;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }
        .main{
            padding: 30px 30px 50px 30px;
            position: relative;
            z-index: 0;
            align-self: flex-end;
            border-radius: 10px;
            color: white;
            overflow: hidden;
            animation: init .5s ease;
            animation-fill-mode: forwards;
            &-bg{
                position: absolute;
                top: 0;
                left: 0;
                z-index: -1;
                width: 100%;
                height: 100%;
                background-color: black;
                opacity: 0.4;
            }
            .title{
                display: flex;
                align-items: center;
                &-pre{
                    display: inline-block;
                    height: 25px;
                    width: 4px;
                    background-color: white;
                }
                span{
                    padding-left: 15px;
                    font-size: 18px;
                }
            }
            .inputs{
                margin-top: 30px;
                &-item{
                    position: relative;
                    margin-bottom: 30px;
                    display: flex;
                    align-items: center;
                    span{
                        position: absolute;
                        left: 0;
                    }
                }
                input{
                    width: 100%;
                    height: 40px;
                    padding-left: 50px;
                    border-bottom: 1px solid #ccc;
                    &::after{
                        position: absolute;
                        z-index: 99;
                        bottom: 20px;
                        display: block;
                        content: '';
                        width: 100px;
                        height: 2px;
                        background-color: aquamarine;
                    }
                }
            }
            button{
                margin-top: 20px;
                height: 40px;
                width: 100%;
                background: none;
                border: 1px solid #ccc;
                &:hover{
                    color: rgb(172, 172, 172);
                    border: 1px solid rgb(172, 172, 172);
                }
            }
        }
        @keyframes init {
            0%{
                margin-right:2.5%;
                width: 0;
                height: 0;
            }
            50%{
                width: 15%;
            }
            75%{
                margin-right:2.5%;
                width: 15%;
                transform: scale(1.1);
            }
            100%{
                margin-right:5%;
                width: 15%;
                transform: scale(1);
            }
        }
    }
</style>
