import { toast } from 'react-hot-toast'
export default function (message) {
    if (message?.error) {
        toast.error(message?.error)
    }
    if (message?.success) {
        toast.success(message?.success)
    }
}