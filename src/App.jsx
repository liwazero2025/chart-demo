import { Routes, Route, Link } from 'react-router-dom'
import * as echarts from 'echarts'
import { useEffect, useRef } from 'react'
import './App.css'

function Home() {
  return (
    <div style={{ padding: '24px' }}>
      <h1>首页</h1>
      <p>这是使用 React Router 和 ECharts 的示例项目。</p>
      <p>点击导航中的“图表示例”查看简单的柱状图。</p>
    </div>
  )
}

function ChartPage() {
  const chartRef = useRef(null)

  useEffect(() => {
    if (!chartRef.current) return

    const chart = echarts.init(chartRef.current)
    chart.setOption({
      title: {
        text: 'ECharts 柱状图示例',
      },
      tooltip: {},
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: '销量',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20, 15],
        },
      ],
    })

    const handleResize = () => {
      chart.resize()
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      chart.dispose()
    }
  }, [])

  return (
    <div style={{ padding: '24px' }}>
      <h1>图表示例</h1>
      <div
        ref={chartRef}
        style={{ width: '100%', height: '400px', border: '1px solid #eee' }}
      />
    </div>
  )
}

function App() {
  return (
    <div>
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 24px',
          borderBottom: '1px solid #eee',
        }}
      >
        <div style={{ fontWeight: 'bold' }}>React + Router + ECharts</div>
        <nav style={{ display: 'flex', gap: '16px' }}>
          <Link to="/">首页</Link>
          <Link to="/chart">图表示例</Link>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chart" element={<ChartPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
