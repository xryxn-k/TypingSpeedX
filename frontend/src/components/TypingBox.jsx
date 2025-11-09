import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { calculateWPM, calculateAccuracy, calculateProgress } from '../utils/calculate'

export default function TypingBox({ text, onComplete, onProgressUpdate, timer = 60, started = false }) {
  const [typed, setTyped] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [errors, setErrors] = useState(0)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [finished, setFinished] = useState(false)
  const inputRef = useRef(null)
  const intervalRef = useRef(null)
  const startTimeRef = useRef(null)
  const typedRef = useRef('')
  const errorsRef = useRef(0)
  const finishedRef = useRef(false)
  const testTextRef = useRef('') // Track the text used for the current test
  const hasStartedRef = useRef(false) // Track if test has actually started

  // Update refs when state changes
  useEffect(() => {
    typedRef.current = typed
    errorsRef.current = errors
    finishedRef.current = finished
  }, [typed, errors, finished])

  const handleFinish = useCallback(() => {
    if (finishedRef.current) return
    
    finishedRef.current = true
    setFinished(true)
    hasStartedRef.current = false
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    
    // Use current timeElapsed or calculate from startTime
    const currentTime = timeElapsed || (startTimeRef.current ? Math.floor((Date.now() - startTimeRef.current) / 1000) : timer)
    const finalTime = Math.min(currentTime, timer)
    const finalTyped = typedRef.current
    const finalErrors = errorsRef.current
    const finalWPM = calculateWPM(finalTyped.length, finalTime)
    const finalAccuracy = calculateAccuracy(finalTyped.length, finalErrors)
    
    if (onComplete) {
      onComplete({
        wpm: finalWPM,
        accuracy: finalAccuracy,
        charactersTyped: finalTyped.length,
        errors: finalErrors,
        timeElapsed: finalTime
      })
    }
  }, [timeElapsed, timer, onComplete])

  // Reset only when text actually changes (not when started changes)
  useEffect(() => {
    // Only reset if text has changed and we're not in the middle of a test
    if (text && (text !== testTextRef.current) && !started) {
      testTextRef.current = text
      hasStartedRef.current = false
      setTyped('')
      typedRef.current = ''
      setCurrentIndex(0)
      setErrors(0)
      errorsRef.current = 0
      setTimeElapsed(0)
      setFinished(false)
      finishedRef.current = false
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [text, started])

  // Handle test start
  useEffect(() => {
    if (started && !finishedRef.current && text) {
      // Only initialize if we haven't started yet or if text changed
      if (!hasStartedRef.current || testTextRef.current !== text) {
        testTextRef.current = text
        hasStartedRef.current = true
        const now = Date.now()
        startTimeRef.current = now
        setTimeElapsed(0)
        setTyped('')
        typedRef.current = ''
        setCurrentIndex(0)
        setErrors(0)
        errorsRef.current = 0
        setFinished(false)
        finishedRef.current = false
        inputRef.current?.focus()
        
        intervalRef.current = setInterval(() => {
          if (startTimeRef.current && !finishedRef.current) {
            const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000)
            if (elapsed >= timer) {
              setTimeElapsed(timer)
              if (intervalRef.current) {
                clearInterval(intervalRef.current)
                intervalRef.current = null
              }
              handleFinish()
            } else {
              setTimeElapsed(elapsed)
            }
          }
        }, 100)
      }
    } else if (!started && !hasStartedRef.current) {
      // Only reset if test hasn't started and we're explicitly not started
      // Don't reset after completion (when started becomes false but hasStartedRef is true)
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current && !started) {
        clearInterval(intervalRef.current)
      }
    }
  }, [started, text, timer, handleFinish])

  const handleInput = (e) => {
    if (finished || !started || !text || !hasStartedRef.current) return

    // Use the test text (not the current prop text) to prevent resets
    const currentText = testTextRef.current || text

    let value = e.target.value
    
    // Filter input to only allow letters and spaces (remove numbers and special characters)
    value = value.replace(/[^a-zA-Z\s]/g, '')
    
    // Don't allow typing beyond the text length
    if (value.length > currentText.length) {
      value = value.substring(0, currentText.length)
    }

    const newIndex = value.length
    let newErrors = 0

    // Count errors by comparing each character (case-insensitive)
    for (let i = 0; i < value.length; i++) {
      if (value[i].toLowerCase() !== currentText[i].toLowerCase()) {
        newErrors++
      }
    }

    setTyped(value)
    typedRef.current = value
    setCurrentIndex(newIndex)
    setErrors(newErrors)
    errorsRef.current = newErrors

    // Calculate stats
    const elapsed = startTimeRef.current ? Math.floor((Date.now() - startTimeRef.current) / 1000) : 0
    const actualTime = elapsed > 0 ? elapsed : 1
    const wpm = calculateWPM(newIndex, actualTime)
    const accuracy = calculateAccuracy(newIndex, newErrors)
    const progress = calculateProgress(newIndex, currentText.length)

    // Update progress
    if (onProgressUpdate) {
      onProgressUpdate({ wpm, accuracy, progress, charactersTyped: newIndex, errors: newErrors, finished: newIndex >= currentText.length })
    }

    // Check if completed
    if (newIndex >= currentText.length) {
      setTimeout(() => {
        if (!finished) {
          handleFinish()
        }
      }, 100)
    }
  }

  const getCharClass = (index) => {
    const currentText = testTextRef.current || text
    if (index < typed.length) {
      // Case-insensitive comparison for validation
      return typed[index].toLowerCase() === currentText[index].toLowerCase() ? 'text-green-400' : 'text-red-500 bg-red-500/20'
    }
    if (index === typed.length) {
      return 'bg-neon-cyan/30 typing-cursor'
    }
    return 'text-gray-500'
  }

  const remainingTime = timer - timeElapsed

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Stats Bar */}
      <div className="glass rounded-lg p-4 mb-6 grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-neon-cyan">
            {started && timeElapsed > 0 ? calculateWPM(typed.length, timeElapsed) : 0}
          </div>
          <div className="text-sm text-gray-400">WPM</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-neon-green">
            {typed.length > 0 ? calculateAccuracy(typed.length, errors) : 100}%
          </div>
          <div className="text-sm text-gray-400">Accuracy</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-neon-pink">
            {started ? (remainingTime > 0 ? remainingTime : 0) : timer}s
          </div>
          <div className="text-sm text-gray-400">Time</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-neon-cyan to-neon-pink"
            initial={{ width: 0 }}
            animate={{ width: `${calculateProgress(currentIndex, (testTextRef.current || text).length)}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Typing Box */}
      <div className="glass rounded-xl p-6 md:p-8 mb-6 w-full">
        <div 
          className="text-base md:text-lg lg:text-xl leading-relaxed font-mono" 
          style={{ 
            wordBreak: 'break-word', 
            overflowWrap: 'break-word',
            whiteSpace: 'pre-wrap',
            maxWidth: '100%'
          }}
        >
          {(testTextRef.current || text).split('').map((char, index) => (
            <span
              key={index}
              className={getCharClass(index)}
            >
              {char === ' ' ? ' ' : char}
            </span>
          ))}
        </div>
      </div>

      {/* Input */}
      <input
        ref={inputRef}
        type="text"
        value={typed}
        onChange={handleInput}
        disabled={finished || !started}
        className="w-full p-4 bg-gray-900 border-2 border-gray-700 rounded-lg focus:border-neon-cyan focus:outline-none text-lg"
        placeholder={started ? "Start typing..." : "Waiting to start..."}
      />

      {finished && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 text-center text-neon-green text-xl font-bold"
        >
          Test Complete! 🎉
        </motion.div>
      )}
    </div>
  )
}
