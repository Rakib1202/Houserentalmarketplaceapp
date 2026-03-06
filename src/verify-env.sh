#!/bin/bash

# HouseRentBD Environment Verification Script
# This script checks if all required .env files exist and are configured

echo "🔍 HouseRentBD Environment Verification"
echo "========================================"
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check counter
PASSED=0
FAILED=0

# Function to check file
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✅ FOUND:${NC} $1"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}❌ MISSING:${NC} $1"
        ((FAILED++))
        return 1
    fi
}

# Function to check file content
check_content() {
    if grep -q "$2" "$1" 2>/dev/null; then
        echo -e "   ${GREEN}✓${NC} Contains: $2"
        return 0
    else
        echo -e "   ${RED}✗${NC} Missing: $2"
        return 1
    fi
}

echo "📁 Checking Environment Files..."
echo "--------------------------------"

# Check Frontend .env
check_file ".env"
if [ $? -eq 0 ]; then
    check_content ".env" "VITE_API_URL"
fi
echo ""

# Check Frontend .env.example
check_file ".env.example"
echo ""

# Check Backend .env
check_file "server/.env"
if [ $? -eq 0 ]; then
    check_content "server/.env" "PORT"
    check_content "server/.env" "MONGODB_URI"
    check_content "server/.env" "JWT_SECRET"
    check_content "server/.env" "CLIENT_URL"
fi
echo ""

# Check Backend .env.example
check_file "server/.env.example"
echo ""

echo "🔌 Checking Services..."
echo "----------------------"

# Check MongoDB
if command -v mongosh &> /dev/null; then
    echo -e "${GREEN}✅ FOUND:${NC} MongoDB CLI (mongosh)"
    ((PASSED++))
    
    # Try to connect to MongoDB
    if mongosh --eval "db.adminCommand('ping')" --quiet &> /dev/null; then
        echo -e "${GREEN}✅ RUNNING:${NC} MongoDB on port 27017"
        ((PASSED++))
    else
        echo -e "${RED}❌ NOT RUNNING:${NC} MongoDB (port 27017)"
        echo -e "   ${YELLOW}💡 Start with:${NC} brew services start mongodb-community@7.0"
        ((FAILED++))
    fi
else
    echo -e "${RED}❌ NOT INSTALLED:${NC} MongoDB"
    echo -e "   ${YELLOW}💡 Install with:${NC} brew install mongodb-community@7.0"
    ((FAILED++))
fi
echo ""

# Check if backend is running
if lsof -Pi :5000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${GREEN}✅ RUNNING:${NC} Backend Server (port 5000)"
    ((PASSED++))
else
    echo -e "${RED}❌ NOT RUNNING:${NC} Backend Server (port 5000)"
    echo -e "   ${YELLOW}💡 Start with:${NC} cd server && npm run dev"
    ((FAILED++))
fi
echo ""

# Check if frontend is running
if lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${GREEN}✅ RUNNING:${NC} Frontend Server (port 5173)"
    ((PASSED++))
else
    echo -e "${RED}❌ NOT RUNNING:${NC} Frontend Server (port 5173)"
    echo -e "   ${YELLOW}💡 Start with:${NC} npm run dev"
    ((FAILED++))
fi
echo ""

# Check Node modules
echo "📦 Checking Dependencies..."
echo "---------------------------"

if [ -d "node_modules" ]; then
    echo -e "${GREEN}✅ FOUND:${NC} Frontend node_modules"
    ((PASSED++))
else
    echo -e "${RED}❌ MISSING:${NC} Frontend node_modules"
    echo -e "   ${YELLOW}💡 Install with:${NC} npm install"
    ((FAILED++))
fi

if [ -d "server/node_modules" ]; then
    echo -e "${GREEN}✅ FOUND:${NC} Backend node_modules"
    ((PASSED++))
else
    echo -e "${RED}❌ MISSING:${NC} Backend node_modules"
    echo -e "   ${YELLOW}💡 Install with:${NC} cd server && npm install"
    ((FAILED++))
fi
echo ""

# Summary
echo "========================================"
echo "📊 Summary"
echo "========================================"
echo -e "${GREEN}Passed:${NC} $PASSED"
echo -e "${RED}Failed:${NC} $FAILED"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ ALL CHECKS PASSED!${NC}"
    echo ""
    echo "🚀 You're ready to start the application!"
    echo ""
    echo "Start the servers in this order:"
    echo "1. MongoDB: brew services start mongodb-community@7.0"
    echo "2. Backend: cd server && npm run dev"
    echo "3. Frontend: npm run dev"
    echo ""
else
    echo -e "${RED}❌ SOME CHECKS FAILED${NC}"
    echo ""
    echo "⚠️  Please fix the issues above before starting the application."
    echo ""
    echo "Quick fixes:"
    echo "• Missing .env files: They should have been created automatically"
    echo "• MongoDB not running: brew services start mongodb-community@7.0"
    echo "• Missing node_modules: npm install && cd server && npm install"
    echo ""
fi

echo "📖 For detailed instructions, see STARTUP_INSTRUCTIONS.md"
echo ""

exit $FAILED
