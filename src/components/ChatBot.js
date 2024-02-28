import React, { useEffect, useRef, useState } from 'react'

import { ChatBubbleLeftIcon, ArrowPathIcon, XMarkIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline'
import { cn } from '../utils';
import axios from 'axios';
import showToaster from '../utils/showToaster';
import { useDispatch, useSelector } from 'react-redux';
import { setHomeSetting, setSitewidebotIndex } from '../store/appSlice';

function Message({
  text,
  isRight = false,
  typing = false,
}) {

  return (
    <div
      className={cn({
        "flex gap-4 items-center max-w-[90%] flex-col flex-row my-2": true,
        "ml-auto justify-end": isRight,
      })}
    >
      <div className={`px-4 py-3 sm:py-6 bg-[#6355D830] rounded-md font-[500] max-w-[600px] ${typing && 'typing'} ${isRight ? 'bg-indigo-500 text-white' : 'bg-[#6355D830]'}`}>
        {text}
        {
          typing &&
          <>
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </>
        }
      </div>
    </div>
  );
}

export default function ChatBot() {
  const dispatch = useDispatch()
  const sitewidebotIndex = useSelector(state => state.app.sitewidebotIndex)
  const homeSetting = useSelector(state => state.app.homeSetting)

  const [messages, setMessages] = useState([])
  const [typing, setTyping] = useState(false)
  const [payload, setPayload] = useState('')
  const inputTextarea = useRef(null)
  const chatBoxRef = useRef(null)

  const [isOpened, setIsOpened] = useState(false)

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const payloadChanged = (e) => {
    inputTextarea.current.style.height = '1px';
    inputTextarea.current.style.height = `${inputTextarea.current.scrollHeight}px`;
    console.log(inputTextarea.current)
    setPayload(e.target.value)
  }

  const init = async () => {
    if (typing) return;
    let greeting = homeSetting?.sitebotGreeting
    try {
      const {data: response }  = await axios.get(process.env.REACT_APP_API_URL + '/api/init-sitewidebot')
      greeting = response.sitebotGreeting;
      dispatch(setSitewidebotIndex(response.index))
    } catch (err) { }
    setMessages([
      { role: 'assistant', content: greeting }
    ]);
  }

  const scrollToBottom = () => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  };

  const handleSend = async (e) => {
    e?.preventDefault()
    if (typing) return;
    const content = payload;
    setMessages([...messages, { role: 'user', content }])
    setTimeout(scrollToBottom, 100)
    setPayload('')
    setTyping(true)
    axios.post(process.env.REACT_APP_API_URL + '/api/sitebot-sendMessage', { messages: [...messages, { role: 'user', content: payload }].slice(-5) })
      .then(({ data: response }) => {
        setMessages([...messages, { role: 'user', content }, { role: 'assistant', content: response.content }])
        setTimeout(scrollToBottom, 100)
        axios.post(process.env.REACT_APP_API_URL + '/api/widgetbot-history', {chatbotIndex: sitewidebotIndex, question: content, answer: response.content, type:'sitewidebot'}).then(() => {}).catch(() => {})
      }).catch(err => {
        setMessages([...messages])
        showToaster(err?.response?.data?.message)
      }).finally(() => {
        setTyping(false)
      })
  };

  useEffect(() => {
    init()
  }, [])

  return (
    <>
      <div className='fixed top-36 right-4 z-[100]'>
        <div className={'fixed inset-0 flex flex-col flex-auto shrink-0 sm:relative sm:w-[420px] sm:h-[620px] sm:max-h-[80vh] shadow-md border rounded-md border-gray-200 bg-white ' + (isOpened ? '' : 'hidden')}>
          <div className='flex justify-between border-b pb-4 m-4 mb-0'>
            <label className='font-bold'>PersonalisationGTP Site Chatbot</label>
            <div className='flex gap-3'>
              <div className='w-5 cursor-pointer' onClick={init}>
                <ArrowPathIcon />
              </div>
              <div className='w-5 cursor-pointer md:hidden' onClick={() => setIsOpened(false)}>
                <XMarkIcon />
              </div>
            </div>
          </div>
          <div className='p-4 py-0 h-full flex flex-col overflow-auto'>
            <div className='h-full overflow-auto px-2' ref={chatBoxRef}>
              {
                messages.map((message, index) => (
                  <Message
                    text={message.content}
                    isRight={message.role === 'user'}
                    key={index}
                  />
                ))
              }
              {
                typing &&
                <Message
                  typing={true}
                  isRight={false}
                />
              }
            </div>
          </div>
          <div className='border-t flex p-4 items-end'>
            <textarea value={payload} placeholder='Message...' className='grow px-2 py-1 resize-none max-h-[90px] focus:outline-none focus-visible:outline-none' ref={inputTextarea} onKeyDown={handleKeyDown} onChange={payloadChanged} style={{ height: '32px' }} />
            <div className='w-6 cursor-pointer' onClick={handleSend}>
              <PaperAirplaneIcon />
            </div>
          </div>
        </div>

      </div>
      <div className='min-w-[60px] min-h-[60px] max-h-[60px] flex justify-center items-center fixed top-20 right-4 z-[99] rounded-full bg-blue-600 cursor-pointer hover:scale-110 transition-all duration-200 ml-auto text-white' onClick={() => setIsOpened(!isOpened)}>
        {
          isOpened &&
          <div className='w-8'>
            <XMarkIcon />
          </div>
        }
        {
          !isOpened && <div className='font-bold text-lg'>SITE</div>
          // <ChatBubbleLeftIcon />
        }
      </div>
    </>
  )
}