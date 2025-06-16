
import { encryptionService } from '@/utils/encryptionService';
import { validateFileUpload, scanFileContent } from '@/utils/fileUploadSecurity';
import { rbacService } from '@/utils/rbacService';
import { aiSecurityService } from '@/services/aiSecurityService';
import { securityLogger } from '@/utils/securityLogger';
import { logger } from '@/utils/productionLogger';

export interface SecurityTestResult {
  testName: string;
  passed: boolean;
  details: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'error';
}

export interface SecurityTestSuite {
  name: string;
  description: string;
  tests: SecurityTestResult[];
  overallStatus: 'passed' | 'failed' | 'warning';
  executionTime: number;
}

class SecurityTestingService {
  private testResults: SecurityTestSuite[] = [];

  async runComprehensiveSecurityTests(): Promise<SecurityTestSuite[]> {
    logger.info('Starting comprehensive security tests', {}, 'SecurityTestingService');
    
    const startTime = Date.now();
    const testSuites: SecurityTestSuite[] = [];

    // Encryption Tests
    testSuites.push(await this.runEncryptionTests());
    
    // File Upload Security Tests
    testSuites.push(await this.runFileUploadSecurityTests());
    
    // RBAC Tests
    testSuites.push(await this.runRBACTests());
    
    // AI Security Tests
    testSuites.push(await this.runAISecurityTests());
    
    // Browser Compatibility Tests
    testSuites.push(await this.runBrowserCompatibilityTests());
    
    // Performance Tests
    testSuites.push(await this.runPerformanceTests());

    const executionTime = Date.now() - startTime;
    
    logger.info('Security tests completed', { 
      totalSuites: testSuites.length,
      executionTime 
    }, 'SecurityTestingService');

    this.testResults = testSuites;
    return testSuites;
  }

  private async runEncryptionTests(): Promise<SecurityTestSuite> {
    const tests: SecurityTestResult[] = [];
    const startTime = Date.now();

    try {
      // Test key generation
      const key = await encryptionService.generateKey();
      tests.push({
        testName: 'Key Generation',
        passed: !!key,
        details: 'Successfully generated encryption key',
        timestamp: new Date().toISOString(),
        severity: 'info'
      });

      // Test data encryption/decryption
      const testData = 'Test sensitive data for encryption';
      const { encryptedData, iv } = await encryptionService.encryptData(testData, key);
      const decryptedData = await encryptionService.decryptData(encryptedData, iv, key);
      
      tests.push({
        testName: 'Data Encryption/Decryption',
        passed: decryptedData === testData,
        details: decryptedData === testData ? 'Data encrypted and decrypted successfully' : 'Encryption/decryption failed',
        timestamp: new Date().toISOString(),
        severity: decryptedData === testData ? 'info' : 'error'
      });

      // Test file encryption
      const testFile = new File(['test file content'], 'test.txt', { type: 'text/plain' });
      const { encryptedFile, metadata } = await encryptionService.encryptFile(testFile, key);
      const decryptedFile = await encryptionService.decryptFile(encryptedFile, metadata, key);
      
      tests.push({
        testName: 'File Encryption/Decryption',
        passed: decryptedFile.name === testFile.name && decryptedFile.type === testFile.type,
        details: 'File encryption and decryption working correctly',
        timestamp: new Date().toISOString(),
        severity: 'info'
      });

    } catch (error) {
      tests.push({
        testName: 'Encryption Error Handling',
        passed: false,
        details: `Encryption test failed: ${error}`,
        timestamp: new Date().toISOString(),
        severity: 'error'
      });
    }

    const overallStatus = tests.every(t => t.passed) ? 'passed' : 
                         tests.some(t => t.severity === 'error') ? 'failed' : 'warning';

    return {
      name: 'Encryption Tests',
      description: 'Client-side encryption functionality validation',
      tests,
      overallStatus,
      executionTime: Date.now() - startTime
    };
  }

  private async runFileUploadSecurityTests(): Promise<SecurityTestSuite> {
    const tests: SecurityTestResult[] = [];
    const startTime = Date.now();

    // Test valid file
    const validFile = new File(['valid content'], 'document.pdf', { type: 'application/pdf' });
    const validResult = validateFileUpload(validFile);
    
    tests.push({
      testName: 'Valid File Upload',
      passed: validResult.isValid,
      details: validResult.isValid ? 'Valid file accepted' : `Validation failed: ${validResult.errors.join(', ')}`,
      timestamp: new Date().toISOString(),
      severity: validResult.isValid ? 'info' : 'error'
    });

    // Test malicious file
    const maliciousFile = new File(['<script>alert("xss")</script>'], 'malicious.exe', { type: 'application/x-executable' });
    const maliciousResult = validateFileUpload(maliciousFile);
    
    tests.push({
      testName: 'Malicious File Rejection',
      passed: !maliciousResult.isValid,
      details: !maliciousResult.isValid ? 'Malicious file correctly rejected' : 'Security vulnerability: malicious file accepted',
      timestamp: new Date().toISOString(),
      severity: !maliciousResult.isValid ? 'info' : 'error'
    });

    // Test content scanning
    const suspiciousContent = new File(['<script>evil()</script>'], 'suspicious.txt', { type: 'text/plain' });
    const contentScanResult = await scanFileContent(suspiciousContent);
    
    tests.push({
      testName: 'Content Scanning',
      passed: !contentScanResult,
      details: !contentScanResult ? 'Suspicious content detected and blocked' : 'Content scanning missed threat',
      timestamp: new Date().toISOString(),
      severity: !contentScanResult ? 'info' : 'warning'
    });

    const overallStatus = tests.every(t => t.passed) ? 'passed' : 
                         tests.some(t => t.severity === 'error') ? 'failed' : 'warning';

    return {
      name: 'File Upload Security Tests',
      description: 'File upload validation and security scanning',
      tests,
      overallStatus,
      executionTime: Date.now() - startTime
    };
  }

  private async runRBACTests(): Promise<SecurityTestSuite> {
    const tests: SecurityTestResult[] = [];
    const startTime = Date.now();

    const testUserId = 'test-user-123';

    // Test role assignment
    try {
      const userRole = rbacService.assignRole(testUserId, 'user', 'system');
      tests.push({
        testName: 'Role Assignment',
        passed: !!userRole,
        details: 'User role assigned successfully',
        timestamp: new Date().toISOString(),
        severity: 'info'
      });

      // Test permission checking
      const hasPermission = rbacService.hasPermission(testUserId, 'read:documents');
      tests.push({
        testName: 'Permission Checking',
        passed: hasPermission,
        details: hasPermission ? 'Permission check working correctly' : 'Permission check failed',
        timestamp: new Date().toISOString(),
        severity: hasPermission ? 'info' : 'error'
      });

      // Test unauthorized access prevention
      const hasAdminPermission = rbacService.hasPermission(testUserId, 'admin:system');
      tests.push({
        testName: 'Unauthorized Access Prevention',
        passed: !hasAdminPermission,
        details: !hasAdminPermission ? 'Unauthorized access correctly prevented' : 'Security issue: unauthorized access allowed',
        timestamp: new Date().toISOString(),
        severity: !hasAdminPermission ? 'info' : 'error'
      });

    } catch (error) {
      tests.push({
        testName: 'RBAC Error Handling',
        passed: false,
        details: `RBAC test failed: ${error}`,
        timestamp: new Date().toISOString(),
        severity: 'error'
      });
    } finally {
      // Cleanup
      rbacService.removeUserRole(testUserId);
    }

    const overallStatus = tests.every(t => t.passed) ? 'passed' : 
                         tests.some(t => t.severity === 'error') ? 'failed' : 'warning';

    return {
      name: 'RBAC Tests',
      description: 'Role-based access control functionality',
      tests,
      overallStatus,
      executionTime: Date.now() - startTime
    };
  }

  private async runAISecurityTests(): Promise<SecurityTestSuite> {
    const tests: SecurityTestResult[] = [];
    const startTime = Date.now();

    // Test threat detection
    const maliciousContent = '<script>alert("xss")</script><img src="x" onerror="evil()">';
    const threatResult = await aiSecurityService.analyzeContentSecurity(maliciousContent, 'test.html');
    
    tests.push({
      testName: 'Threat Detection',
      passed: threatResult.threatLevel !== 'low',
      details: `Threat level: ${threatResult.threatLevel}, Threats: ${threatResult.threats.length}`,
      timestamp: new Date().toISOString(),
      severity: threatResult.threatLevel !== 'low' ? 'info' : 'warning'
    });

    // Test behavioral analysis
    const suspiciousActions = ['rapid_file_uploads', 'multiple_failed_logins', 'unusual_access_times'];
    const behavioralPattern = aiSecurityService.analyzeBehavioralPattern('test-user', suspiciousActions);
    
    tests.push({
      testName: 'Behavioral Analysis',
      passed: behavioralPattern.pattern !== 'normal',
      details: `Pattern: ${behavioralPattern.pattern}, Risk Score: ${behavioralPattern.riskScore}%`,
      timestamp: new Date().toISOString(),
      severity: behavioralPattern.pattern !== 'normal' ? 'info' : 'warning'
    });

    // Test alert creation
    const alert = aiSecurityService.createSecurityAlert(
      'threat_detected',
      'high',
      'Test security alert',
      'test-user',
      { testMode: true }
    );
    
    tests.push({
      testName: 'Security Alert Creation',
      passed: !!alert.id,
      details: 'Security alert created successfully',
      timestamp: new Date().toISOString(),
      severity: 'info'
    });

    const overallStatus = tests.every(t => t.passed) ? 'passed' : 
                         tests.some(t => t.severity === 'error') ? 'failed' : 'warning';

    return {
      name: 'AI Security Tests',
      description: 'AI-powered security analysis and threat detection',
      tests,
      overallStatus,
      executionTime: Date.now() - startTime
    };
  }

  private async runBrowserCompatibilityTests(): Promise<SecurityTestSuite> {
    const tests: SecurityTestResult[] = [];
    const startTime = Date.now();

    // Test Web Crypto API support
    const cryptoSupported = !!(window.crypto && window.crypto.subtle);
    tests.push({
      testName: 'Web Crypto API Support',
      passed: cryptoSupported,
      details: cryptoSupported ? 'Web Crypto API is supported' : 'Web Crypto API not available',
      timestamp: new Date().toISOString(),
      severity: cryptoSupported ? 'info' : 'error'
    });

    // Test localStorage availability
    const localStorageSupported = (() => {
      try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
        return true;
      } catch {
        return false;
      }
    })();
    
    tests.push({
      testName: 'Local Storage Support',
      passed: localStorageSupported,
      details: localStorageSupported ? 'Local storage is available' : 'Local storage not available',
      timestamp: new Date().toISOString(),
      severity: localStorageSupported ? 'info' : 'warning'
    });

    // Test modern JavaScript features
    const modernJSSupported = !!(Promise && Array.prototype.includes && Object.entries);
    tests.push({
      testName: 'Modern JavaScript Support',
      passed: modernJSSupported,
      details: modernJSSupported ? 'Modern JavaScript features supported' : 'Legacy browser detected',
      timestamp: new Date().toISOString(),
      severity: modernJSSupported ? 'info' : 'warning'
    });

    const overallStatus = tests.every(t => t.passed) ? 'passed' : 
                         tests.some(t => t.severity === 'error') ? 'failed' : 'warning';

    return {
      name: 'Browser Compatibility Tests',
      description: 'Cross-browser security feature compatibility',
      tests,
      overallStatus,
      executionTime: Date.now() - startTime
    };
  }

  private async runPerformanceTests(): Promise<SecurityTestSuite> {
    const tests: SecurityTestResult[] = [];
    const startTime = Date.now();

    // Test encryption performance
    const encryptionStartTime = performance.now();
    try {
      const key = await encryptionService.generateKey();
      const largeData = 'x'.repeat(10000); // 10KB of data
      await encryptionService.encryptData(largeData, key);
      const encryptionTime = performance.now() - encryptionStartTime;
      
      tests.push({
        testName: 'Encryption Performance',
        passed: encryptionTime < 1000, // Should complete within 1 second
        details: `Encryption completed in ${encryptionTime.toFixed(2)}ms`,
        timestamp: new Date().toISOString(),
        severity: encryptionTime < 1000 ? 'info' : 'warning'
      });
    } catch (error) {
      tests.push({
        testName: 'Encryption Performance',
        passed: false,
        details: `Encryption performance test failed: ${error}`,
        timestamp: new Date().toISOString(),
        severity: 'error'
      });
    }

    // Test security logging performance
    const loggingStartTime = performance.now();
    for (let i = 0; i < 100; i++) {
      securityLogger.logEvent({
        type: 'auth_attempt',
        details: { test: true, iteration: i },
        severity: 'low'
      });
    }
    const loggingTime = performance.now() - loggingStartTime;
    
    tests.push({
      testName: 'Security Logging Performance',
      passed: loggingTime < 500, // Should complete within 500ms
      details: `100 security events logged in ${loggingTime.toFixed(2)}ms`,
      timestamp: new Date().toISOString(),
      severity: loggingTime < 500 ? 'info' : 'warning'
    });

    const overallStatus = tests.every(t => t.passed) ? 'passed' : 
                         tests.some(t => t.severity === 'error') ? 'failed' : 'warning';

    return {
      name: 'Performance Tests',
      description: 'Security feature performance validation',
      tests,
      overallStatus,
      executionTime: Date.now() - startTime
    };
  }

  getTestResults(): SecurityTestSuite[] {
    return [...this.testResults];
  }

  generateTestReport(): string {
    const report = {
      timestamp: new Date().toISOString(),
      totalSuites: this.testResults.length,
      totalTests: this.testResults.reduce((acc, suite) => acc + suite.tests.length, 0),
      passedSuites: this.testResults.filter(suite => suite.overallStatus === 'passed').length,
      failedSuites: this.testResults.filter(suite => suite.overallStatus === 'failed').length,
      warningSuites: this.testResults.filter(suite => suite.overallStatus === 'warning').length,
      testSuites: this.testResults
    };

    return JSON.stringify(report, null, 2);
  }
}

export const securityTestingService = new SecurityTestingService();
