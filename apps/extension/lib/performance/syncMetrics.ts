/**
 * 탭 간 하이라이트 동기화 성능 측정 유틸리티
 * Message Broadcast 패턴의 지연 시간을 자동으로 측정합니다.
 *
 * Note: performance.timeOrigin + performance.now()를 사용하여
 * 서로 다른 컨텍스트(Background, Content) 간 고정밀도 시간 측정을 수행합니다.
 */

export interface SyncMetric {
	highlightId: string;
	timestamp: number;
	latency: number;
	action: "added" | "deleted";
}

class SyncMetricsCollector {
	private metrics: SyncMetric[] = [];
	private readonly MAX_METRICS = 100; // 최대 100개까지 저장

	/**
	 * 측정 기록 (수신 탭에서 호출)
	 */
	record(
		highlightId: string,
		latency: number,
		action: "added" | "deleted",
	): void {
		this.metrics.push({
			highlightId,
			timestamp: Date.now(),
			latency,
			action,
		});

		// 100개 초과 시 오래된 것 제거
		if (this.metrics.length > this.MAX_METRICS) {
			this.metrics.shift();
		}
	}

	/**
	 * 현재까지 측정된 모든 메트릭 조회
	 */
	getAllMetrics(): SyncMetric[] {
		return [...this.metrics];
	}

	/**
	 * 평균 지연 시간 계산
	 */
	getAverageLatency(): number {
		if (this.metrics.length === 0) return 0;

		const sum = this.metrics.reduce((acc, m) => acc + m.latency, 0);
		return sum / this.metrics.length;
	}

	/**
	 * 최소/최대 지연 시간
	 */
	getLatencyRange(): { min: number; max: number } | null {
		if (this.metrics.length === 0) return null;

		const latencies = this.metrics.map((m) => m.latency);
		return {
			min: Math.min(...latencies),
			max: Math.max(...latencies),
		};
	}

	/**
	 * 통계 요약 출력
	 */
	printSummary(): void {
		const avg = this.getAverageLatency();
		const range = this.getLatencyRange();

		console.group("📊 Message Broadcast 성능 측정 결과");
		console.log(`총 측정 횟수: ${this.metrics.length}`);
		console.log(`평균 지연 시간: ${avg.toFixed(2)}ms`);
		if (range) {
			console.log(`최소 지연 시간: ${range.min.toFixed(2)}ms`);
			console.log(`최대 지연 시간: ${range.max.toFixed(2)}ms`);
		}
		console.groupEnd();
	}

	/**
	 * 메트릭 초기화
	 */
	reset(): void {
		this.metrics = [];
		console.log("[SyncMetrics] 측정 데이터 초기화됨");
	}

	/**
	 * CSV 형식으로 내보내기
	 */
	exportToCSV(): string {
		const header = "highlightId,action,timestamp,latency\n";
		const rows = this.metrics
			.map((m) => `${m.highlightId},${m.action},${m.timestamp},${m.latency}`)
			.join("\n");
		return header + rows;
	}
}

// 싱글톤 인스턴스
export const syncMetrics = new SyncMetricsCollector();

// 전역에 노출 (개발자 콘솔에서 접근 가능)
if (typeof window !== "undefined") {
	// biome-ignore lint/suspicious/noExplicitAny: 개발자 콘솔 접근을 위한 전역 노출
	(window as any).__syncMetrics = syncMetrics;
}
