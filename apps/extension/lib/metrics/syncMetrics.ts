/**
 * 탭 간 하이라이트 동기화 성능 측정 유틸리티
 */

interface SyncRecord {
	highlightId: string;
	latency: number; // ms
	action: "added" | "deleted";
	timestamp: number; // performance.timeOrigin + performance.now()
}

class SyncMetrics {
	private records: SyncRecord[] = [];

	/**
	 * 동기화 레코드 기록
	 */
	record(highlightId: string, latency: number, action: "added" | "deleted") {
		this.records.push({
			highlightId,
			latency,
			action,
			timestamp: performance.timeOrigin + performance.now(),
		});
	}

	/**
	 * 모든 레코드 가져오기
	 */
	getRecords(): SyncRecord[] {
		return [...this.records];
	}

	/**
	 * 통계 계산
	 */
	getStats() {
		if (this.records.length === 0) {
			return {
				count: 0,
				avgLatency: 0,
				minLatency: 0,
				maxLatency: 0,
				stdDev: 0,
			};
		}

		const latencies = this.records.map((r) => r.latency);
		const count = latencies.length;
		const avgLatency = latencies.reduce((a, b) => a + b, 0) / count;
		const minLatency = Math.min(...latencies);
		const maxLatency = Math.max(...latencies);

		// 표준 편차 계산
		const variance =
			latencies.reduce((sum, val) => sum + (val - avgLatency) ** 2, 0) / count;
		const stdDev = Math.sqrt(variance);

		return {
			count,
			avgLatency: Number(avgLatency.toFixed(2)),
			minLatency: Number(minLatency.toFixed(2)),
			maxLatency: Number(maxLatency.toFixed(2)),
			stdDev: Number(stdDev.toFixed(2)),
		};
	}

	/**
	 * 콘솔에 요약 출력
	 */
	printSummary() {
		const stats = this.getStats();

		if (stats.count === 0) {
			console.log("📊 동기화 측정 데이터가 없습니다.");
			return;
		}

		console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
		console.log("📊 하이라이트 동기화 성능 측정 결과");
		console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
		console.log(`📈 총 측정 횟수: ${stats.count}회`);
		console.log(`⏱️  평균 지연 시간: ${stats.avgLatency}ms`);
		console.log(`⚡ 최소 지연 시간: ${stats.minLatency}ms`);
		console.log(`🐌 최대 지연 시간: ${stats.maxLatency}ms`);
		console.log(`📏 표준 편차: ${stats.stdDev}ms`);
		console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

		// 세부 데이터 출력
		console.log("\n📋 세부 측정 데이터:");
		const latencies = this.records.map((r) => r.latency.toFixed(2));
		console.log(latencies.join(", ") + "ms");
		console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
	}

	/**
	 * 레코드 초기화
	 */
	clear() {
		this.records = [];
		console.log("✅ 동기화 측정 데이터가 초기화되었습니다.");
	}
}

// 싱글톤 인스턴스
export const syncMetrics = new SyncMetrics();

// 전역 노출 (개발자 도구에서 접근 가능)
if (typeof window !== "undefined") {
	(window as any).__syncMetrics = syncMetrics;
}
