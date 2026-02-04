import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class AiAnalysisService {
    private readonly logger = new Logger(AiAnalysisService.name)

    async analyzeReport(report: any) {
        
        this.logger.debug(`AI analysis hook called for reports${report.id}`)
        return {
            status: 'pending',
            confidence: null,
            suggest_case_type: null,
            summary: null
        }
    }
}