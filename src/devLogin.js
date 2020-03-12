import {login} from '@/service'
export default function devLogin() {
    setInterval(() => {
        if (sessionStorage.getItem('account') && sessionStorage.getItem('password')) {
            console.log('devLogin',sessionStorage.getItem('account'));
            login(sessionStorage.getItem('account'),sessionStorage.getItem('password'))
        }
    }, 1000)
}